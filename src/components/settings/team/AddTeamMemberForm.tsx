
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamMemberSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.string().min(1, "Selecione uma função"),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

// Define the return type to include required status field
interface TeamMemberFormData extends TeamMemberFormValues {
  status: "invited";
}

interface AddTeamMemberFormProps {
  onSubmit: (data: TeamMemberFormData) => void;
  onCancel: () => void;
}

export const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const handleSubmit = (data: TeamMemberFormValues) => {
    onSubmit({ ...data, status: "invited" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="joao.silva@exemplo.com" {...field} />
              </FormControl>
              <FormDescription>
                Um convite será enviado para este endereço de email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Gerente de Vendas">Gerente de Vendas</SelectItem>
                  <SelectItem value="Atendente">Atendente</SelectItem>
                  <SelectItem value="Gestor de Campanhas">Gestor de Campanhas</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Define quais permissões este membro terá no sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Enviar Convite</Button>
        </div>
      </form>
    </Form>
  );
};
