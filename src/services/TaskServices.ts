export const getAllTask = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/task`);
    if (!response.ok) {
      throw new Error("Failed to fetch task results");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
