import React from "react";

export default function DeleteModal({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">🗑️</span>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-3 text-center text-gray-500">
          {message}
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-500 py-3 font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}