const verifyUser = async (access_token) => {
    try {
      const response = await fetch('http://141.164.63.217:4545/verifyuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token })
      });

      if (response.ok) {
        const data = await response.json();
        return { email: data.email };
      } else {
        return { email: null };
      }
    } catch (error) {
      console.error('Error verifying user', error);
      return { email: null };
    }
  };

export default verifyUser;