import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toast, Slide } from "react-toastify";
import { ContactSkeletonLoader } from "../components/SkeletonLoader";
import axiosInstance from "../utils/axiosInstance";

// Zod Schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(4, "Message must be at least 4 characters"),
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Convert Zod errors to Formik errors
  const validate = (values) => {
    try {
      contactSchema.parse(values);
      return {};
    } catch (error) {
      const errors = {};
      error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return errors;
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (!currentUser) {
        toast.error("Please login to send a message", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        });
        return;
      }

      // Send to backend
      const response = await axiosInstance.post("/feedback/submit", {
        userId: currentUser.id,
        userEmail: values.email,
        userName: values.name,
        subject: "Contact Form Message",
        message: values.message,
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });

      setSubmitted(true);
      resetForm();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(error.response?.data?.message || "Failed to send message", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    }
  };

  if (loading) return <ContactSkeletonLoader />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Contact <span className="text-orange-500">Us</span>
        </h1>

        <p className="text-gray-500 mt-3">
          Have a question? We'd love to hear from you.
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
          <img
            className="size-12 mb-4"
            src="https://www.svgrepo.com/show/422280/correct-success-tick.svg"
            alt="Correct"
          />

          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Message Sent!
          </h2>

          <p className="text-green-600 text-sm">
            Thank you for reaching out. We'll get back to you soon!
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl active:scale-95 cursor-pointer text-sm font-medium transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-8 border-t-4 border-orange-500">
          <Formik
            initialValues={{
              name: "",
              email: "",
              message: "",
            }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>

                  <Field
                    type="text"
                    name="name"
                    id="name-input"
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />

                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-xs mt-2 ml-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>

                  <Field
                    type="email"
                    name="email"
                    id="email-input"
                    placeholder="hello@gmail.com"
                    autoComplete="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-2 ml-1"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>

                  <Field
                    as="textarea"
                    name="message"
                    id="message-input"
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                  />

                  <ErrorMessage
                    name="message"
                    component="p"
                    className="text-red-500 text-xs mt-2 ml-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !(isValid && dirty)}
                  className="w-full bg-orange-500 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 cursor-pointer disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          {
            icon: (
              <img
                className="size-8"
                src="https://www.svgrepo.com/show/502648/email.svg"
                alt="Email"
              />
            ),
            label: "Email",
            value: "hello@producthub.com",
          },
          {
            icon: (
              <img
                className="size-8"
                src="https://www.svgrepo.com/show/522677/telephone.svg"
                alt="Phone"
              />
            ),
            label: "Phone",
            value: "+x xxxxxxxxxx",
          },
          {
            icon: (
              <img
                className="size-8"
                src="https://www.svgrepo.com/show/532540/location-pin-alt-1.svg"
                alt="Location"
              />
            ),
            label: "Location",
            value: "Islamabad, Pakistan",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-xl"
          >
            <div className="text-2xl mb-1 flex justify-center">{item.icon}</div>

            <div className="text-xs text-gray-400">{item.label}</div>

            <div className="text-xs font-medium text-gray-700 mt-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;

// using react hook form and zod for validation

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// // Zod Schema
// const contactSchema = z.object({
//   name: z.string().min(1, "Name is required"),

//   email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Invalid email address"),

//   message: z
//     .string()
//     .min(1, "Message is required")
//     .min(4, "Message must be at least 4 characters"),
// });

// function Contact() {
//   const [submitted, setSubmitted] = useState(false);

//   window.scrollTo(0, 0);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isValid, isSubmitting, isDirty },
//   } = useForm({
//     mode: "onChange",
//     defaultValues: {
//       name: "",
//       email: "",
//       message: "",
//     },
//   });

//   // Submit Handler
//   const onSubmit = async (data) => {
//     try {
//       // Validate with Zod
//       contactSchema.parse(data);

//       console.log("Form submitted:", data);

//       setSubmitted(true);

//       reset();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Header */}
//       <div className="text-center mb-10">
//         <h1
//           className="text-4xl font-bold text-gray-900"
//           style={{ fontFamily: "Playfair Display, serif" }}
//         >
//           Contact Us
//         </h1>

//         <p className="text-gray-500 mt-3">
//           Have a question? We'd love to hear from you.
//         </p>
//       </div>

//       {submitted ? (
//         <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
//           <img
//             className="size-12 mb-4"
//             src="https://www.svgrepo.com/show/422280/correct-success-tick.svg"
//             alt="Correct"
//           />

//           <h2 className="text-xl font-semibold text-green-700 mb-2">
//             Message Sent!
//           </h2>

//           <p className="text-green-600 text-sm">
//             Thank you for reaching out. We'll get back to you soon.
//           </p>

//           <button
//             onClick={() => setSubmitted(false)}
//             className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors"
//           >
//             Send Another Message
//           </button>
//         </div>
//       ) : (
//         <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-5"
//           >
//             {/* Name */}
//             <div>
//               <label
//                 htmlFor="name-input"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Your Name
//               </label>

//               <input
//                 type="text"
//                 id="name-input"
//                 placeholder="Your name"
//                 autoComplete="name"
//                 {...register("name", {
//                   required: "Name is required",
//                 })}
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
//               />

//               {errors.name && (
//                 <p className="text-red-500 text-xs mt-2 ml-1">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email-input"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 id="email-input"
//                 placeholder="hello@gmail.com"
//                 autoComplete="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value:
//                       /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
//               />

//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-2 ml-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Message */}
//             <div>
//               <label
//                 htmlFor="message-input"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Message
//               </label>

//               <textarea
//                 id="message-input"
//                 rows={5}
//                 placeholder="Write your message here..."
//                 {...register("message", {
//                   required: "Message is required",
//                   minLength: {
//                     value: 4,
//                     message:
//                       "Message must be at least 4 characters",
//                   },
//                 })}
//                 className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
//               />

//               {errors.message && (
//                 <p className="text-red-500 text-xs mt-2 ml-1">
//                   {errors.message.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting || !(isValid && isDirty)}
//               className="w-full bg-orange-500 hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-colors"
//             >
//               Send Message
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Contact Info */}
//       <div className="grid grid-cols-3 gap-4 mt-8">
//         {[
//           {
//             icon: (
//               <img
//                 className="size-8"
//                 src="https://www.svgrepo.com/show/502648/email.svg"
//                 alt="Email"
//               />
//             ),
//             label: "Email",
//             value: "hello@producthub.com",
//           },
//           {
//             icon: (
//               <img
//                 className="size-8"
//                 src="https://www.svgrepo.com/show/522677/telephone.svg"
//                 alt="Phone"
//               />
//             ),
//             label: "Phone",
//             value: "+x xxxxxxxxxx",
//           },
//           {
//             icon: (
//               <img
//                 className="size-8"
//                 src="https://www.svgrepo.com/show/532540/location-pin-alt-1.svg"
//                 alt="Location"
//               />
//             ),
//             label: "Location",
//             value: "Islamabad, Pakistan",
//           },
//         ].map((item) => (
//           <div
//             key={item.label}
//             className="bg-white border border-gray-100 rounded-xl p-4 text-center"
//           >
//             <div className="text-2xl mb-1 flex justify-center">
//               {item.icon}
//             </div>

//             <div className="text-xs text-gray-400">
//               {item.label}
//             </div>

//             <div className="text-xs font-medium text-gray-700 mt-1">
//               {item.value}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Contact;
