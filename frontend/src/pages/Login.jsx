import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  emailId: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="text-4xl font-bold text-center text-primary">
            BeatCode
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Login to continue coding
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div>
              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                {...register("emailId")}
                type="email"
                placeholder="you@example.com"
                className={`input input-bordered w-full ${
                  errors.emailId ? "input-error" : ""
                }`}
              />

              {errors.emailId && (
                <p className="text-error text-sm mt-1">
                  {errors.emailId.message}
                </p>
              )}
            </div>


            <div>
              <label className="label">
                <span className="label-text">
                  Password
                </span>
              </label>

              <input
                {...register("password")}
                type="password"
                placeholder="********"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
              />

              {errors.password && (
                <p className="text-error text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>


            <div className="text-right">
              <span className="text-sm text-primary cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>


            <button className="btn btn-primary w-full mt-2">
              Login
            </button>

          </form>


          <p className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;