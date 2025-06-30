import { FcGoogle } from "react-icons/fc";
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:7001/api/v1/auth/google';
  };

  return (
    <button
  onClick={handleGoogleLogin}
  className="mt-5 m-auto flex items-center gap-3 px-5 py-2 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white text-gray-700 font-medium"
>
  <FcGoogle className="text-xl" />
  <span>Sign in with Google</span>
</button>
  );
};

export default GoogleLoginButton;
