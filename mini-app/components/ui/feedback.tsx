"use client";

export interface FeedbackProps {
  message: string;
  type: "win" | "lose";
}

export function Feedback({ message, type }: FeedbackProps) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div
        className={`p-6 rounded-lg text-white ${
          type === "win" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <h2 className="text-2xl font-bold">{message}</h2>
      </div>
    </div>
  );
}
