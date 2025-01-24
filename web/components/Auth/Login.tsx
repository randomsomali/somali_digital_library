"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppDictionary } from "@/types/dictionary";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Input } from "@/components/ui/input"; // Assuming you have an Input component

interface LoginProps {
  dictionary: AppDictionary;
}

const Login: React.FC<LoginProps> = ({ dictionary }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError(dictionary.auth.invalidCredentials);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen ">
      <div className=" p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {dictionary.auth.login}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          <Button type="submit" className="w-full">
            {dictionary.auth.login}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
