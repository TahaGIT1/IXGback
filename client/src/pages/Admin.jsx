import api from "../api/axios";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const EMPTY_RUN = {
  title: "",
  location: "",
  date: "",
  time: "",
  distance: "",
  registered: 0,
  registrationOpen: true,
};

// Handles old API/database values safely while you migrate them.
const toBoolean = (value) => value === true || value === "true";

export default function Admin() {
  const navigate = useNavigate();



  const [checkingAuth, setCheckingAuth] = useState(true);
  const [runData, setRunData] = useState(EMPTY_RUN);
  const [runs, setRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [selectedRegistrationRun, setSelectedRegistrationRun] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteRegModal, setShowDeleteRegModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDeleteRunModal, setShowDeleteRunModal] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);
  const [deletingRunId, setDeletingRunId] = useState(null);
  const [deletingRegistrationId, setDeletingRegistrationId] = useState(null);

  const [inviteQuantity, setInviteQuantity] = useState(5);

const [inviteCodes, setInviteCodes] = useState([]);

const [selectedInviteRun, setSelectedInviteRun] = useState(null);

const [inviteLoading, setInviteLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimers = useRef({ show: null, hide: null, remove: null });
  const [inviteSearch, setInviteSearch] = useState("");

  const showStatus = useCallback((type, text) => {
    clearTimeout(toastTimers.current.show);
    clearTimeout(toastTimers.current.hide);
    clearTimeout(toastTimers.current.remove);

    setToast({ type, text });
    setToastVisible(false);

    toastTimers.current.show = setTimeout(() => {
      setToastVisible(true);
    }, 10);

    toastTimers.current.hide = setTimeout(() => {
      setToastVisible(false);

      toastTimers.current.remove = setTimeout(() => {
        setToast(null);
      }, 300);
    }, 3500);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimers.current.show);
      clearTimeout(toastTimers.current.hide);
      clearTimeout(toastTimers.current.remove);
    };
  }, []);

  const handleAuthFailure = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        await api.get("/api/auth/verify");
        setCheckingAuth(false);
      } catch {
        handleAuthFailure();
      }
    };

    verifyToken();
  }, [navigate, handleAuthFailure]);

  const fetchRuns = useCallback(async () => {
    setRunsLoading(true);

    try {
      const response = await api.get("/api/runs");

      const receivedRuns = Array.isArray(response.data) ? response.data : [];

      setRuns(
        receivedRuns.map((run) => ({
          ...run,
          registrationOpen: toBoolean(run.registrationOpen),
          registered: Number(run.registered || 0),
        }))
      );
    } catch (error) {
      
      showStatus("error", "Couldn't load runs. Please refresh.");
    } finally {
      setRunsLoading(false);
    }
  }, [showStatus]);

  // Fetch registrations only for the run selected in Admin.
  const fetchRegistrations = useCallback(
    async (runId) => {
      if (!runId) {
        setRegistrations([]);
        return;
      }

      setRegistrationsLoading(true);

      try {
        const response = await api.get("/api/register", {
          params: { runId },
        });

        setRegistrations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
       

        if (error.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        showStatus("error", "Couldn't load registrations.");
      } finally {
        setRegistrationsLoading(false);
      }
    },
    [handleAuthFailure, showStatus]
  );

  const fetchInviteCodes = async (runId) => {
  try {
    const res = await api.get(`/api/invite/${runId}`);

    setInviteCodes(res.data);

  } catch (error) {
    

    showStatus("error", "Failed to load invite codes.");
  }
};
const filteredInviteCodes = useMemo(() => {
  const term = inviteSearch.toLowerCase();

  return inviteCodes.filter((code) =>
    code.code.toLowerCase().includes(term)
  );
}, [inviteCodes, inviteSearch]);

  const generateInviteCodes = async (run) => {
  try {
    setInviteLoading(true);

    setSelectedInviteRun(run);

    await api.post("/api/invite/generate", {
      runId: run._id,
      quantity: inviteQuantity,
    });

    await fetchInviteCodes(run._id);

    showStatus("success", `${inviteQuantity} invite codes generated.`);
  } catch (error) {
    

    showStatus("error", "Failed to generate invite codes.");
  } finally {
    setInviteLoading(false);
  }
};

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);

    showStatus("success", "Invite code copied.");
  } catch (error) {
    
    showStatus("error", "Failed to copy code.");
  }
};


 useEffect(() => {
  const load = async () => {
    if (checkingAuth) return;

    await fetchRuns();
  };

  load();
}, [checkingAuth, fetchRuns]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRunData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  };

  useEffect(() => {
  if (runs.length === 0) return;

  const savedRunId = localStorage.getItem("selectedInviteRun");

  if (!savedRunId) return;

  const run = runs.find((r) => r._id === savedRunId);

  if (!run) return;

  setSelectedInviteRun(run);
  setSelectedRegistrationRun(run);

  fetchInviteCodes(run._id);
  fetchRegistrations(run._id);
}, [runs]);

  const validateRun = (data) => {
    const errors = {};

    if (!data.title.trim()) errors.title = "Title is required";
    if (!data.location.trim()) errors.location = "Location is required";
    if (!data.date) errors.date = "Date is required";
    if (!data.time) errors.time = "Time is required";
    if (!data.distance.trim()) errors.distance = "Distance is required";

    return errors;
  };

  const handleEdit = (run) => {
    setRunData({
      title: run.title || "",
      location: run.location || "",
      date: run.date || "",
      time: run.time || "",
      distance: run.distance || "",
      registered: Number(run.registered || 0),
      registrationOpen: toBoolean(run.registrationOpen),
    });

    setEditingId(run._id);
    setFormErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setRunData(EMPTY_RUN);
    setEditingId(null);
    setFormErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateRun(runData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showStatus("error", "Please fill in all required fields.");
      return;
    }

    const payload = {
      title: runData.title.trim(),
      location: runData.location.trim(),
      date: runData.date,
      time: runData.time,
      distance: runData.distance.trim(),
      registered: Number(runData.registered || 0),
      registrationOpen: Boolean(runData.registrationOpen),
    };

    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/api/runs/${editingId}`, payload);
        showStatus("success", "Run updated successfully.");
      } else {
        await api.post("/api/runs", payload);
        showStatus("success", "Run created successfully.");
      }

      await fetchRuns();
      handleCancelEdit();
    } catch (error) {
      
      showStatus("error", "Failed to save run.");
    } finally {
      setSubmitting(false);
    }
  };

  const viewRegistrations = async (run) => {
  setSelectedRegistrationRun(run);
  setSelectedInviteRun(run);      // <-- remember this run for Invite Manager
  localStorage.setItem("selectedInviteRun", run._id);
  setSearchTerm("");

  document.getElementById("registrations")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  await Promise.all([
    fetchRegistrations(run._id),
    fetchInviteCodes(run._id),    // <-- load existing invite codes
  ]);
};

  const filteredRegistrations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return registrations.filter((registration) => {
      const matchesSearch =
        !term ||
        registration.name?.toLowerCase().includes(term) ||
        registration.phone?.includes(term);

      return matchesSearch;
    });
  }, [registrations, searchTerm]);

  const requestDeleteRun = (run) => {
    setSelectedRun(run);
    setShowDeleteRunModal(true);
  };

  const handleDeleteRun = async () => {
    if (!selectedRun) return;

    const runId = selectedRun._id;

    setShowDeleteRunModal(false);
    setDeletingRunId(runId);

    try {
      await api.delete(`/api/runs/${runId}`);

      if (editingId === runId) {
        handleCancelEdit();
      }

      if (selectedRegistrationRun?._id === runId) {
        setSelectedRegistrationRun(null);
        setRegistrations([]);
        setSearchTerm("");
      }

      await fetchRuns();
      showStatus("success", "Run and its registrations deleted successfully.");
    } catch (error) {
      
      showStatus("error", "Failed to delete run.");
    } finally {
      setDeletingRunId(null);
      setSelectedRun(null);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    setDeletingRegistrationId(registrationId);

    try {
      await api.delete(`/api/register/${registrationId}`);

      if (selectedRegistrationRun?._id) {
        await Promise.all([
          fetchRegistrations(selectedRegistrationRun._id),
          fetchRuns(),
        ]);
      }

      showStatus("success", "Registration deleted.");
    } catch (error) {
      
      showStatus("error", "Failed to delete registration.");
    } finally {
      setDeletingRegistrationId(null);
    }
  };

  const escapeCsvCell = (value) => {
    const stringValue = String(value ?? "");
    const safeValue = /^[=+\-@]/.test(stringValue)
      ? `'${stringValue}`
      : stringValue;

    return /[",\n]/.test(safeValue)
      ? `"${safeValue.replace(/"/g, '""')}"`
      : safeValue;
  };

  const exportCSV = () => {
    if (!selectedRegistrationRun || !filteredRegistrations.length) {
      showStatus("error", "Select a run with registrations to export.");
      return;
    }

    const rows = filteredRegistrations.map((runner) => [
      runner.name,
      runner.phone,
      runner.email,
      runner.age,
      new Date(runner.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      ["Name", "Phone", "Email", "Age", "Registered On"],
      ...rows,
    ]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedRegistrationRun.title
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()}-registrations.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  if (checkingAuth) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Checking your session...</p>
      </section>
    );
  }

  const availableCount = inviteCodes.filter(
  (code) => code.status === "Available"
).length;

const usedCount = inviteCodes.filter(
  (code) => code.status === "Used"
).length;

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              IXG Admin Panel
            </h1>
            <p className="mt-2 text-gray-500">
              Create and manage community runs.
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed right-6 top-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
              toastVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-6 opacity-0"
            } ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
          noValidate
        >
          {editingId && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <span>Editing an existing run</span>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="font-semibold underline"
              >
                Cancel
              </button>
            </div>
          )}

          {[
            ["title", "text", "Run Title"],
            ["location", "text", "Location"],
            ["date", "date", ""],
            ["time", "time", ""],
            ["distance", "text", "Distance"],
          ].map(([name, type, placeholder]) => (
            <div key={name}>
              <label htmlFor={name} className="sr-only">
                {name}
              </label>

              <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={runData[name]}
                onChange={handleChange}
                className={`w-full rounded-xl border p-3 ${
                  formErrors[name] ? "border-red-400" : ""
                }`}
              />

              {formErrors[name] && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors[name]}
                </p>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 rounded-xl border p-4">
            <input
              type="checkbox"
              id="registrationOpen"
              checked={runData.registrationOpen}
              onChange={(event) =>
                setRunData((previous) => ({
                  ...previous,
                  registrationOpen: event.target.checked,
                }))
              }
              className="h-5 w-5"
            />

            <label
              htmlFor="registrationOpen"
              className="font-medium text-gray-700"
            >
              Registrations Open
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-800 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
                ? "Update Run"
                : "Create Run"}
          </button>
        </form>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Community Runs</h2>

          {runsLoading ? (
            <p className="text-gray-500">Loading runs...</p>
          ) : runs.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-gray-500">
              No runs yet. Create your first one above.
            </p>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <div
                  key={run._id}
                  className="rounded-2xl border bg-gray-50 p-5 shadow-sm"
                >
                  <h3 className="text-xl font-bold">{run.title}</h3>
                  <p className="mt-2 text-gray-600">
                    Location: {run.location}
                  </p>
                  <p className="text-gray-600">
                    Date: {run.date} at {run.time}
                  </p>
                  <p className="text-gray-600">Distance: {run.distance}</p>
                  <p className="text-gray-600">
                    Registered: {run.registered}
                  </p>

                  <p
                    className={`mt-2 font-semibold ${
                      run.registrationOpen
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {run.registrationOpen
                      ? "Registrations Open"
                      : "Registrations Closed"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => viewRegistrations(run)}
                      className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                      View Registrations ({run.registered})
                    </button>
                     <button
  onClick={() => generateInviteCodes(run)}
  disabled={inviteLoading}
  className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
>
  {inviteLoading ? "Generating..." : "Generate Invite Codes"}
</button>
                    <button
                      onClick={() => handleEdit(run)}
                      disabled={deletingRunId === run._id}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-60"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => requestDeleteRun(run)}
                      disabled={deletingRunId === run._id}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white disabled:opacity-60"
                    >
                      {deletingRunId === run._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

  

        <div id="registrations" className="mt-12 scroll-mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                Runner Registrations{" "}
                <span className="text-base font-normal text-gray-500">
                  ({filteredRegistrations.length})
                </span>
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedRegistrationRun
                  ? `Showing registrations for: ${selectedRegistrationRun.title}`
                  : "Select a run above to view its registrations."}
              </p>
            </div>

            <button
              onClick={exportCSV}
              disabled={
                !selectedRegistrationRun || !filteredRegistrations.length
              }
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export CSV
            </button>
          </div>

          {selectedRegistrationRun && (
            <div className="mb-6">
              <label htmlFor="search" className="sr-only">
                Search registrations
              </label>

              <input
                id="search"
                type="text"
                placeholder="Search by name or phone"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
          )}

          {!selectedRegistrationRun ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-gray-500">
              Choose a run to see its registered runners.
            </p>
          ) : registrationsLoading ? (
            <p className="text-gray-500">Loading registrations...</p>
          ) : filteredRegistrations.length === 0 ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-gray-500">
              {searchTerm
                ? "No registrations match your search."
                : "No registrations for this run yet."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Name",
                      "Phone",
                      "Email",
                      "Age",
                      "Registered On",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredRegistrations.map((runner) => (
                    <tr key={runner._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{runner.name}</td>
                      <td className="px-4 py-3">{runner.phone}</td>
                      <td className="px-4 py-3">{runner.email}</td>
                      <td className="px-4 py-3">{runner.age}</td>
                      <td className="px-4 py-3">
                        {new Date(runner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedRegistration(runner);
                            setShowDeleteRegModal(true);
                          }}
                          disabled={deletingRegistrationId === runner._id}
                          className="rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-60"
                        >
                          {deletingRegistrationId === runner._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
        </div>

       

               <DeleteModal
          isOpen={showDeleteRegModal}
          title="Delete Registration"
          message={
            selectedRegistration
              ? `Are you sure you want to delete ${selectedRegistration.name}'s registration?`
              : ""
          }
          onCancel={() => {
            setShowDeleteRegModal(false);
            setSelectedRegistration(null);
          }}
          onConfirm={() => {
            if (selectedRegistration) {
              handleDeleteRegistration(selectedRegistration._id);
            }

            setShowDeleteRegModal(false);
            setSelectedRegistration(null);
          }}
        />

        <DeleteModal
          isOpen={showDeleteRunModal}
          title="Delete Run"
          message={
            selectedRun
              ? `Are you sure you want to delete "${selectedRun.title}" and all its registrations?`
              : ""
          }
          onCancel={() => {
            setShowDeleteRunModal(false);
            setSelectedRun(null);
          }}
          onConfirm={handleDeleteRun}
        />

        {/* Invite Manager */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">Invite Manager</h2>

          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium">Quantity</label>

            <input
              type="number"
              min="1"
              max="500"
              value={inviteQuantity}
              onChange={(e) => setInviteQuantity(Number(e.target.value))}
              className="w-28 rounded-lg border p-2"
            />
          </div>

          {!selectedInviteRun ? (
            <p className="rounded-xl border border-dashed p-6 text-center text-gray-500">
              Select a run and generate invite codes.
            </p>
          ) : (
            <>
              <p className="mb-4 text-gray-500">
                Invite codes for <strong>{selectedInviteRun.title}</strong>
              </p>

              <div className="mb-6 flex gap-4">
  <div className="rounded-lg bg-green-100 px-4 py-2">
    <p className="text-sm text-gray-600">Available</p>
    <p className="text-xl font-bold text-green-700">
      {availableCount}
    </p>
  </div>

  

  <div className="rounded-lg bg-red-100 px-4 py-2">
    <p className="text-sm text-gray-600">Used</p>
    <p className="text-xl font-bold text-red-700">
      {usedCount}
    </p>
  </div>
</div>
<div className="mb-4">
  <input
    type="text"
    placeholder="Search invite code..."
    value={inviteSearch}
    onChange={(e) => setInviteSearch(e.target.value)}
    className="w-full rounded-lg border p-3"
  />
</div>
              <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Invite Code</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">
  Action
</th>
                    </tr>
                  </thead>

                  <tbody>
                    {inviteCodes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          No invite codes generated yet.
                        </td>
                      </tr>
                    ) : (
                     filteredInviteCodes.map((code) => (
                        <tr key={code._id} className="border-t">
                          <td className="px-4 py-3 font-mono">
                            {code.code}
                          </td>
                          <td className="px-4 py-3">
  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${
      code.status === "Available"
        ? "bg-green-100 text-green-700"
        
        : "bg-red-100 text-red-700"
    }`}
  >
    {code.status}
  </span>
</td>
                         <td className="px-4 py-3">
  <div className="flex gap-2">
    <button
      onClick={() => copyCode(code.code)}
      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
    >
      Copy
    </button>

   
  </div>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}