import { useEffect, useState } from "react";

export default function TestApi() {
  const [data, setData] = useState("Chargement...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/clients/", {
      headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY1OTc4MDE4LCJpYXQiOjE3NjU5NzQ0MTgsImp0aSI6ImVkNWMwNmZkZWRiZDQ0Yjg5OGM4Y2MzMWU5ZDI3OGExIiwidXNlcl9pZCI6IjMifQ.U1mU1nXlHqc3V7IDgcl7BQrN_9s2pno-6u9WgFmbk_o",
      },
    })
      .then((res) => res.text())
      .then((text) => setData(text))
      .catch((err) => setError(err.toString()));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Test liaison API</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre>{data}</pre>
    </div>
  );
}

