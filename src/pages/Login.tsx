
import LoginForm from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Atlas</h1>
          <p className="text-gray-600">Sistema de Gestão da Fábrica de Software</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
