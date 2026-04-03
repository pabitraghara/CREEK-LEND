import { useState } from "react";

export default function EmployeeModal() {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddEmployee = async () => {
    if (!name) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If using auth token:
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Employee added successfully!");
        setName("");
        setIsAddingEmployee(false);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Open Modal Button */}
      <button
        onClick={() => setIsAddingEmployee(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Add Employee
      </button>

      {/* Modal */}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>

            {/* Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter employee name"
              className="border p-2 w-full rounded mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingEmployee(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddEmployee}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
