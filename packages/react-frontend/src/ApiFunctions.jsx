const API_BASE_URL = "https://tasko-api.azurewebsites.net";

export const api = {
  login: async (userName, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Login failed:", {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
        });
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in login request:", error.message);
      throw error;
    }
  },

  createAccount: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Failed to create account:", {
          status: response.status,
          statusText: response.statusText,
          details: errorDetails,
        });
        throw new Error(
          `Failed to create account: ${response.status} ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in createAccount request:", error.message);
      throw error;
    }
  },

  // Lists
  getLists: async (userName) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/users/${userName}/lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch lists");
    return response.json();
  },

  createList: async (userName, listName) => {
    const token = localStorage.getItem("token");
    const listID = crypto.randomUUID();
    const response = await fetch(`${API_BASE_URL}/users/${userName}/lists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listID,
        listName,
      }),
    });
    if (!response.ok) throw new Error("Failed to create list");
    return response.json();
  },

  deleteList: async (userName, listId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/${userName}/lists/${listId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Failed to delete list");
    return response.json();
  },

  // Tasks
  createTask: async (userName, listId, taskData) => {
    const token = localStorage.getItem("token");
    const taskID = crypto.randomUUID();
    const response = await fetch(
      `${API_BASE_URL}/users/${userName}/lists/${listId}/tasks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskID,
          taskName: taskData.text,
          dueDate: taskData.dueDate,
        }),
      },
    );
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  updateTask: async (userName, listId, taskId, updates) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/${userName}/lists/${listId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      },
    );
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  deleteTask: async (userName, listId, taskId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/users/${userName}/lists/${listId}/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) throw new Error("Failed to delete task");
    return response.json();
  },
};
