import { yupResolver } from "@hookform/resolvers/yup";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button, Container, Flex, IconButton, Text, TextField } from "@radix-ui/themes";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ShowIf from "@/components/show-if";

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(10).max(64).required(),
  })
  .required();

export function Component() {
  // State
  const [showPassword, togglePassword] = useToggle(false);
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
          <strong>Stacy</strong> Onboarding
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Root placeholder="Email" size="3" {...register("email")} />

            <TextField.Root placeholder="Password" size="3" type={showPassword ? "text" : "password"} {...register("password")}>
              <TextField.Slot side="right">
                <IconButton onClick={() => togglePassword()} type="button" variant="ghost" className="cursor-pointer" radius="full">
                  <ShowIf condition={showPassword}>
                    <EyeOpenIcon height="16" width="16" />
                  </ShowIf>
                  <ShowIf condition={!showPassword}>
                    <EyeClosedIcon height="16" width="16" />
                  </ShowIf>
                </IconButton>
              </TextField.Slot>
            </TextField.Root>

            <ShowIf condition={!!errors.email || !!errors.password}>
              <Flex direction="column" gap="0" className="text-orange-600">
                <Text size="2">
                  <strong>Error:</strong> {[errors.email?.message, errors.password?.message].filter((t) => Boolean(t)).join(", ")}
                </Text>
              </Flex>
            </ShowIf>

            <Text className="text-gray-400" size="1">
              This account will act as an admin. You can always manage account roles or add other accounts later.
            </Text>
            <Button size="3" type="submit" className="cursor-pointer">
              Create Account
            </Button>
          </Flex>
        </form>
      </div>
    </Container>
  );
}
