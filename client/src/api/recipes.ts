export const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1/recipes`;

async function withAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
    
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}
// export function generateRecipe(body: any) {
//   return withAuth('/generate-openai', { method: 'POST', body: JSON.stringify(body) });
// }

export function getUserRecipes() {
  return withAuth('/', { method: 'GET' });
}

export function deleteRecipe(id: string) {
  return withAuth(`/${id}`, { method: 'DELETE' });
}

export function getRecipe(id: string) {
  return withAuth(`/${id}`, { method: 'GET' });
}
