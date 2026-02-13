"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditUser() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id; // get user id from the route safely

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});

  // Fetch user data when component mounts
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("name", userData.name || "");
      formData.append("email", userData.email || "");

      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");
      router.push("/admin/users"); // redirect after successful update
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit User: {id}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={userData.name || ""}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={userData.email || ""}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
}
