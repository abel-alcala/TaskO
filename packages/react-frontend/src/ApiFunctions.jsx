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
      const response = await fetch(`${API_BASE_URL}/register`, {
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
    if (response.status === 204) {
      return { message: "List successfully deleted" };
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error deleting list");
    }
    return data;
  },

  // Tasks
  createTask: async (userName, listId, taskData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `${API_BASE_URL}/users/${userName}/lists/${listId}/tasks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskName: taskData.taskName,
            notes: taskData.notes || null,
            dueDate: taskData.dueDate || null,
            completed: taskData.completed || false,
            remindDate: taskData.remindDate || null,
            priority: taskData.priority || null,
          }),
        },
      );
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Failed to create task: ${errorBody.message}`);
      }
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  updateTask: async (userName, listId, taskId, updates) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

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

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Failed to update task: ${errorBody.message}`);
      }
      return await response.json();
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  deleteTask: async (userName, listId, taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

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
      if (response.status === 204) {
        return { message: "Task successfully deleted" };
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error deleting task");
      }
      return data;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
};
