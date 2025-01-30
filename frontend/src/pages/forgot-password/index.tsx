import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Flex, Link, Text, TextField } from "@radix-ui/themes";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ShowIf from "@/components/show-if";

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

export function Component() {
  // State
  const [_showPassword, _togglePassword] = useToggle(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Handlers
  const onSubmit = (data: yup.InferType<typeof schema>) => {
    console.log("HERE", data);
  };

  return (
    <Container size="1">
      <div className="-mt-20 flex min-h-screen flex-col justify-center space-y-4 px-2 md:px-12">
        <img src="/flag-in-hole.svg" alt="logo" className="mx-auto h-16 w-16" />
        <Text size="6" align="center" weight="medium">
          Forgot Password
        </Text>

        <Text className="text-gray-500" size="2" align="center">
          Please enter your email address. We will send you an email to reset your password.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Root placeholder="Email" size="3" {...register("email")} />

            <ShowIf condition={!!errors.email}>
              <Flex direction="column" gap="0" className="text-orange-600">
                <Text size="2">
                  <strong>Error:</strong> {[errors.email?.message].filter((t) => Boolean(t)).join(", ")}
                </Text>
              </Flex>
            </ShowIf>

            <Button size="3" type="submit" className="cursor-pointer">
              Send Email
            </Button>
          </Flex>
        </form>
        <Flex>
          <Link href="/login" className="text-gray-500 underline" size="2">
            Back to Log In
          </Link>
        </Flex>
      </div>
    </Container>
  );
}
