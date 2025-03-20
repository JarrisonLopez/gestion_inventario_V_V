import connectToDatabase from "@/app/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req) {
  const { username, password } = await req.json();

  // Validación simple del usuario
  await connectToDatabase();
  const user = await User.findOne({ username, password }); // Usuario y contraseña simples
  if (!user) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });
  }

  // Configura la cookie con el rol del usuario
  const response = new Response(JSON.stringify({ message: 'Inicio de sesión exitoso' }), {
    status: 200,
  });
  response.headers.set(
    'Set-Cookie',
    `role=${user.role}; Path=/; Max-Age=3600; HttpOnly`
  );

  return response;
}