import React from "react";

export default function NotFoundPage() {
  return (
    <div class="flex flex-col h-screen w-screen items-center justify-center">
      <h1 class="text-8xl font-bold uppercase text-blue-200">404</h1>
      <h2 class="mt-2 tracking-widest text-xl font-bold uppercase text-blue-200">Not Found</h2>
      <a href="/" className="mt-8 text-sm uppercase underline text-gray-600">Take me home</a>
    </div>
  )
}
