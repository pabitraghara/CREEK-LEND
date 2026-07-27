"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { ApplicationData } from "../ApplicationWizard";
import { addressSchema, extractFieldErrors } from "@/lib/validation";
import { US_STATES } from "@/lib/constants";

interface Props {
  data: ApplicationData;
  updateData: (updates: Partial<ApplicationData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAddress({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const updateDataRef = useRef(updateData);
  updateDataRef.current = updateData;
  const authFailedRef = useRef(false);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components) return;

    let street_number = "";
    let route = "";
    let city = "";
    let state = "";
    let zipCode = "";

    for (const component of place.address_components) {
      const type = component.types[0];
      switch (type) {
        case "street_number":
          street_number = component.long_name;
          break;
        case "route":
          route = component.long_name;
          break;
        case "locality":
          city = component.long_name;
          break;
        case "sublocality_level_1":
          if (!city) city = component.long_name;
          break;
        case "administrative_area_level_1":
          state = component.short_name;
          break;
        case "postal_code":
          zipCode = component.long_name;
          break;
      }
    }

    const streetAddress = street_number ? `${street_number} ${route}` : route;

    updateDataRef.current({
      streetAddress,
      city,
      state,
      zipCode,
      country: "US",
    });

    setErrors({});
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const inputEl = inputRef.current;
    if (!apiKey || !inputEl) {
      setIsGoogleApiLoaded(false);
      return;
    }

    let listener: { remove: () => void } | null = null;

    const teardownAutocomplete = () => {
      listener?.remove();
      listener = null;
      // Strip Google's internal DOM listeners off the autocomplete and the
      // input element itself — otherwise keystrokes keep hitting the failed
      // Places request and the Next.js dev overlay catches the errors.
      const gMaps = (
        window as unknown as {
          google?: {
            maps?: {
              event?: { clearInstanceListeners: (instance: unknown) => void };
            };
          };
        }
      ).google?.maps?.event;
      if (gMaps) {
        if (autocompleteRef.current)
          gMaps.clearInstanceListeners(autocompleteRef.current);
        gMaps.clearInstanceListeners(inputEl);
      }
      autocompleteRef.current = null;
      document.querySelectorAll(".pac-container").forEach((el) => el.remove());
    };

    // Fires on RefererNotAllowedMapError, InvalidKeyMapError, etc. — these
    // happen at runtime after the script has already loaded, so importLibrary
    // resolves successfully and .catch() never sees them. Setting the handler
    // before importLibrary ensures we catch failures that fire during init.
    (window as unknown as { gm_authFailure: () => void }).gm_authFailure =
      () => {
        authFailedRef.current = true;
        setApiError(
          "Google address autocomplete is unavailable. Please enter your address manually.",
        );
        setIsGoogleApiLoaded(false);
        teardownAutocomplete();
      };

    setOptions({ key: apiKey });

    importLibrary("places")
      .then((places) => {
        // Auth already failed while the library was loading — don't attach.
        if (authFailedRef.current || !inputRef.current) return;

        const autocomplete = new places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "us" },
          types: ["address"],
          fields: ["address_components"],
        });

        listener = autocomplete.addListener("place_changed", handlePlaceSelect);
        autocompleteRef.current = autocomplete;
        setIsGoogleApiLoaded(true);
      })
      .catch((error) => {
        console.warn(
          "Google Maps API failed to load:",
          error?.message || error,
        );
        const errorMsg = error?.message || "Failed to load Google Maps API";
        setApiError(errorMsg);
        setIsGoogleApiLoaded(false);
        autocompleteRef.current = null;
      });

    return () => {
      teardownAutocomplete();
      delete (window as unknown as { gm_authFailure?: () => void })
        .gm_authFailure;
    };
  }, [handlePlaceSelect]);

  const handleNext = () => {
    const result = addressSchema.safeParse({
      streetAddress: data.streetAddress,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
    });

    if (!result.success) {
      setErrors(extractFieldErrors(result.error));
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-1">
        Residential Address
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Enter your current residential address.
      </p>

      <div className="space-y-5">
        {/* {apiError && (
          <div className="bg-warning/10 border border-warning rounded-lg p-3 text-xs text-text-secondary">
            {apiError}
          </div>
        )} */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label
              htmlFor="streetAddress"
              className="block text-sm font-medium text-text-primary"
            >
              Street Address *
            </label>
            {/* {isGoogleApiLoaded && (
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                Auto-complete enabled
              </span>
            )}
            {!isGoogleApiLoaded && (
              <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                Manual entry
              </span>
            )} */}
          </div>
          {/* <input
            key={apiError ? "manual" : "google"}
            ref={inputRef}
            type="text"
            id="streetAddress"
            value={data.streetAddress}
            onChange={(e) => updateData({ streetAddress: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.streetAddress
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder={
              isGoogleApiLoaded
                ? "Start typing your address..."
                : "Enter street address (e.g., 123 Main St)"
            }
            autoComplete="off"
          /> */}
          <input
            type="text"
            id="streetAddress"
            value={data.streetAddress}
            onChange={(e) => updateData({ streetAddress: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.streetAddress
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="Enter street address (e.g., 123 Main St)"
            autoComplete="street-address"
          />
          {errors.streetAddress && (
            <p className="text-error text-xs mt-1">{errors.streetAddress}</p>
          )}
          {/* {!isGoogleApiLoaded && (
            <p className="text-text-secondary text-xs mt-1">
              Please enter your address manually
            </p>
          )} */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.city
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              }`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-error text-xs mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              State *
            </label>
            <select
              id="state"
              value={data.state}
              onChange={(e) => updateData({ state: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                errors.state
                  ? "border-error"
                  : "border-surface-dark focus:border-primary"
              }`}
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-error text-xs mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="sm:w-1/2">
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            ZIP Code *
          </label>
          <input
            type="text"
            id="zipCode"
            value={data.zipCode}
            onChange={(e) => updateData({ zipCode: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg transition-colors ${
              errors.zipCode
                ? "border-error"
                : "border-surface-dark focus:border-primary"
            }`}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="text-error text-xs mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-end gap-3 mb-2">
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <svg
              className="w-3.5 h-3.5 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your data is protected by bank-level security
          </span>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary font-medium px-6 py-3 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
