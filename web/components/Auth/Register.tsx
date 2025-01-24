"use client";
import React, { useState } from "react";
import { registerClient } from "@/lib/api";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Input } from "@/components/ui/input"; // Assuming you have an Input component

interface RegisterProps {
  dictionary: AppDictionary;
}

const Register: React.FC<RegisterProps> = ({ dictionary }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerClient({ username, password, phone });
      setSuccess(dictionary.auth.registerSuccess);
      setError(""); // Clear error on success
    } catch (err) {
      setError(dictionary.auth.usernameExists);
      setSuccess(""); // Clear success message on error
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen ">
      <div className=" p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {dictionary.auth.signup}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder={dictionary.auth.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-4"
          />
          <Input
            type="password"
            placeholder={dictionary.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4"
          />
          <Input
            type="text"
            placeholder={dictionary.auth.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            {dictionary.auth.signup}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Register;
