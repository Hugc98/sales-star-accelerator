
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

interface SearchFilters {
  status: string[];
  source: string[];
  potentialValue: [number, number];
  lastContact: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface LeadSearchProps {
  onFilterChange?: (filters: SearchFilters) => void;
  onSearchChange?: (term: string) => void;
}

const LeadSearch: React.FC<LeadSearchProps> = ({ onFilterChange, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const form = useForm<SearchFilters>({
    defaultValues: {
      status: [],
      source: [],
      potentialValue: [0, 100000],
      lastContact: "",
      sortBy: "recentes",
      sortOrder: "desc",
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const applyFilters = (data: SearchFilters) => {
    const filters: string[] = [];
    
    if (data.status.length > 0) {
      filters.push(`Status: ${data.status.length}`);
    }
    
    if (data.source.length > 0) {
      filters.push(`Fonte: ${data.source.length}`);
    }
    
    if (data.lastContact) {
      filters.push(`Contato: ${data.lastContact}`);
    }
    
    if (data.potentialValue[0] > 0 || data.potentialValue[1] < 100000) {
      filters.push(`Valor: R$${data.potentialValue[0]}-R$${data.potentialValue[1]}`);
    }
    
    setActiveFilters(filters);
    setOpenFilterDialog(false);
    
    if (onFilterChange) {
      onFilterChange(data);
    }
  };

  const clearFilters = () => {
    form.reset({
      status: [],
      source: [],
      potentialValue: [0, 100000],
      lastContact: "",
      sortBy: "recentes",
      sortOrder: "desc",
    });
    setActiveFilters([]);
    
    if (onFilterChange) {
      onFilterChange(form.getValues());
    }
  };

  const removeFilter = (filter: string) => {
    const newFilters = activeFilters.filter((f) => f !== filter);
    setActiveFilters(newFilters);
    // Implementation would need to update the actual filter state
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, empresa, email..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filtros</span>
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Filtros Avançados</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(applyFilters)}
                className="space-y-6 py-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["novo", "contatado", "qualificado", "negociação", "fechado", "perdido"].map((status) => (
                          <Badge
                            key={status}
                            variant={field.value.includes(status) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              field.value.includes(status) ? "" : "hover:bg-muted"
                            }`}
                            onClick={() => {
                              if (field.value.includes(status)) {
                                field.onChange(field.value.filter((s) => s !== status));
                              } else {
                                field.onChange([...field.value, status]);
                              }
                            }}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["WhatsApp", "Instagram", "Facebook", "Email", "Site", "Indicação"].map((source) => (
                          <Badge
                            key={source}
                            variant={field.value.includes(source) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              field.value.includes(source) ? "" : "hover:bg-muted"
                            }`}
                            onClick={() => {
                              if (field.value.includes(source)) {
                                field.onChange(field.value.filter((s) => s !== source));
                              } else {
                                field.onChange([...field.value, source]);
                              }
                            }}
                          >
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="potentialValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        Valor potencial
                        <span className="text-sm font-normal text-muted-foreground">
                          R${field.value[0].toLocaleString()} - R${field.value[1].toLocaleString()}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[0, 100000]}
                          max={100000}
                          step={1000}
                          value={field.value}
                          onValueChange={field.onChange}
                          className="mt-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Último contato</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="">Todos</SelectItem>
                            <SelectItem value="hoje">Hoje</SelectItem>
                            <SelectItem value="semana">Esta semana</SelectItem>
                            <SelectItem value="mes">Este mês</SelectItem>
                            <SelectItem value="+30">Mais de 30 dias</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sortBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordenar por</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Ordenar por" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="recentes">Data de criação</SelectItem>
                              <SelectItem value="valor">Valor potencial</SelectItem>
                              <SelectItem value="probabilidade">Probabilidade de fechamento</SelectItem>
                              <SelectItem value="interacao">Tempo sem interação</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange as (value: string) => void}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Ordem" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="desc">Decrescente</SelectItem>
                              <SelectItem value="asc">Crescente</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setOpenFilterDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Aplicar filtros</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5H17M3 12H13M3 19.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 7.5L18 3.5M18 3.5L14 7.5M18 3.5V20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden md:inline">Ordenar</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ordenar por</h4>
                <Select
                  defaultValue="recentes"
                  onValueChange={(value) => {
                    form.setValue("sortBy", value);
                    if (onFilterChange) {
                      onFilterChange(form.getValues());
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="recentes">Data de criação</SelectItem>
                      <SelectItem value="valor">Valor potencial</SelectItem>
                      <SelectItem value="probabilidade">Probabilidade de fechamento</SelectItem>
                      <SelectItem value="interacao">Tempo sem interação</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ordem</h4>
                <div className="flex gap-2">
                  <Button
                    variant={form.getValues("sortOrder") === "desc" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      form.setValue("sortOrder", "desc");
                      if (onFilterChange) {
                        onFilterChange(form.getValues());
                      }
                    }}
                  >
                    Decrescente
                  </Button>
                  <Button
                    variant={form.getValues("sortOrder") === "asc" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      form.setValue("sortOrder", "asc");
                      if (onFilterChange) {
                        onFilterChange(form.getValues());
                      }
                    }}
                  >
                    Crescente
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex gap-1 items-center px-2 py-1">
              {filter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadSearch;
