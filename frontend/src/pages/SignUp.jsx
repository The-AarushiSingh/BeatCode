import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { registerUser } from "../store/authSlice"; // adjust path
import { z } from "zod";

const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),

  emailId: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});


function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-2">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="text-4xl font-bold text-center text-primary">
            BeatCode
          </h1>

          <p className="text-center mb-6">
            Create your account and start coding
          </p>


          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div>
              <label className="label">
                Name
              </label>

              <input
                {...register("firstName")}
                placeholder="John Doe"
                className="input input-bordered w-full"
              />

              {errors.firstName && (
                <p className="text-error text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>


            <div>
              <label className="label">
                Email
              </label>

              <input
                {...register("emailId")}
                placeholder="example@gmail.com"
                className="input input-bordered w-full"
              />

              {errors.emailId && (
                <p className="text-error text-sm">
                  {errors.emailId.message}
                </p>
              )}
            </div>


            <div>
              <label className="label">
                Password
              </label>

              <input
                {...register("password")}
                type="password"
                placeholder="******"
                className="input input-bordered w-full"
              />

              {errors.password && (
                <p className="text-error text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>


            <button
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default SignUp;