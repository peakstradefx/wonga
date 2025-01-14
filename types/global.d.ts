import mongoose from "mongoose";

declare global {
  const mongoose: {
    [x: string]: any;
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
