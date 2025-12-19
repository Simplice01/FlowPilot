import { useEffect, useState } from "react";
import api from "./api/axios";

export default function TestApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("clients/")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setError("Erreur API");
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Test liaison API</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
