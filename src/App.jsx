import { useState } from "react";

function App() {

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);


  const [customer, setCustomer] = useState({
    customer_id: "",
    name: "",
    gender: "",
    location: "",
  });
  const [customerRes, setCustomerRes] = useState(null);
  const [adding, setAdding] = useState(false);


  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    setCustomerRes(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      const data = await res.json();
      setCustomerRes(data);
      setCustomer({ customer_id: "", name: "", gender: "", location: "" }); 
    } catch (err) {
      setCustomerRes({ error: err.message });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 20 }}>
      <h1>Atin's LLM Chatbot with Customer Management</h1>

      {}
      <section style={{ marginBottom: "3rem" }}>
        <h2>Run SQL Query</h2>
        <form onSubmit={handleQuerySubmit}>
          <textarea
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Input your query here"
            style={{ width: "100%", padding: 10, borderRadius: 6 }}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Running..." : "Run Query"}
          </button>
        </form>

        {response && (
          <div style={{ marginTop: 30 }}>
      

            {response.results && response.results.length > 0 ? (
              <>
                <h3>Results</h3>
                <table border="1" cellPadding="8">
                  <thead>
                    <tr>
                      {Object.keys(response.results[0]).map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {response.results.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, i) => (
                          <td key={i}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>No rows returned.</p>
            )}

            {response.error && (
              <p style={{ color: "red" }}>Error: {response.error}</p>
            )}
          </div>
        )}
      </section>

      {}
      <section>
        <h2>Add New Customer</h2>
        <form onSubmit={handleCustomerSubmit}>
          <input
            type="number"
            placeholder="Customer ID"
            value={customer.customer_id}
            onChange={(e) =>
              setCustomer({ ...customer, customer_id: e.target.value })
            }
            required
          />
          <br />
          <input
            type="text"
            placeholder="Name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            required
          />
          <br />
          <input
            type="text"
            placeholder="Gender"
            value={customer.gender}
            onChange={(e) =>
              setCustomer({ ...customer, gender: e.target.value })
            }
            required
          />
          <br />
          <input
            type="text"
            placeholder="Location"
            value={customer.location}
            onChange={(e) =>
              setCustomer({ ...customer, location: e.target.value })
            }
            required
          />
          <br />
          <button type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add Customer"}
          </button>
        </form>

        {customerRes && (
          <div style={{ marginTop: 20 }}>
            <h3>Response</h3>
            <pre>{JSON.stringify(customerRes, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
