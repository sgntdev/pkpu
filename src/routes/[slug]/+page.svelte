<script>
    let loading = false;
    let error = null;
    let success = null;
  
    const handleSubmit = async (event) => {
      let { target } = event;
      loading = true;
      error = null;
      success = null;
  
      try {
        const response = await fetch("?/sendEmail", {
          method: "POST",
          body: new FormData(target),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          success = "Email berhasil dikirim";
        } else {
          throw new Error(result.error || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        error = err.message || "Failed to send email";
      } finally {
        loading = false;
      }
    };
  </script>
  
  <main>
    {#if loading}
      <p>Loading...</p>
    {:else if error}
      <p style="color: red;">Error: {error}</p>
    {:else if success}
      <p style="color: green;">{success}</p>
    {:else}
      <h1>Welcome to Kurator.id</h1>
      <form on:submit={handleSubmit}>
        <h3>Input your email</h3>
        <input type="email" name="to" placeholder="Enter your email" />
        <button type="submit">Submit</button>
      </form>
    {/if}
  </main>