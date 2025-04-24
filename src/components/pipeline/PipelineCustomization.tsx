
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export type PipelineStage = {
  id: string;
  name: string;
  color: string;
  order: number;
  autoAdvance: boolean;
  advanceConditions?: {
    type: "time" | "action" | "value";
    value: string | number;
  }[];
};

interface PipelineCustomizationProps {
  stages: PipelineStage[];
  onStagesChange: (stages: PipelineStage[]) => void;
}

const defaultColors = [
  "#007BFF", // Azul Elétrico
  "#6C5CE7", // Roxo
  "#FDCB6E", // Amarelo
  "#FF7675", // Vermelho Claro
  "#00B894", // Verde Sucesso
  "#636E72", // Cinza Escuro
];

const PipelineCustomization: React.FC<PipelineCustomizationProps> = ({
  stages,
  onStagesChange,
}) => {
  const [localStages, setLocalStages] = useState<PipelineStage[]>(stages);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newStage, setNewStage] = useState<Partial<PipelineStage>>({
    name: "",
    color: defaultColors[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalStages(updatedItems);
    onStagesChange(updatedItems);
    
    toast({
      title: "Etapas reordenadas",
      description: "A ordem das etapas foi atualizada com sucesso.",
    });
  };

  const handleAddStage = () => {
    if (!newStage.name) return;
    
    const newStageComplete: PipelineStage = {
      id: `stage-${Date.now()}`,
      name: newStage.name,
      color: newStage.color || defaultColors[localStages.length % defaultColors.length],
      order: localStages.length,
      autoAdvance: false,
      advanceConditions: [],
    };
    
    const updatedStages = [...localStages, newStageComplete];
    setLocalStages(updatedStages);
    onStagesChange(updatedStages);
    setIsAddDialogOpen(false);
    setNewStage({ name: "", color: defaultColors[0] });
    
    toast({
      title: "Etapa adicionada",
      description: `A etapa "${newStageComplete.name}" foi adicionada com sucesso.`,
    });
  };

  const handleEditStage = () => {
    if (!editingStage || !editingStage.name) return;
    
    const updatedStages = localStages.map((stage) =>
      stage.id === editingStage.id ? editingStage : stage
    );
    
    setLocalStages(updatedStages);
    onStagesChange(updatedStages);
    setIsEditDialogOpen(false);
    setEditingStage(null);
    
    toast({
      title: "Etapa atualizada",
      description: `A etapa "${editingStage.name}" foi atualizada com sucesso.`,
    });
  };

  const handleDeleteStage = () => {
    if (!editingStage) return;
    
    if (localStages.length <= 1) {
      toast({
        title: "Não é possível excluir",
        description: "É necessário manter pelo menos uma etapa no pipeline.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedStages = localStages
      .filter((stage) => stage.id !== editingStage.id)
      .map((stage, index) => ({
        ...stage,
        order: index,
      }));
    
    setLocalStages(updatedStages);
    onStagesChange(updatedStages);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Etapa removida",
      description: `A etapa "${editingStage.name}" foi removida com sucesso.`,
    });
  };

  const startEdit = (stage: PipelineStage) => {
    setEditingStage({ ...stage });
    setIsEditDialogOpen(true);
  };

  const startDelete = (stage: PipelineStage) => {
    setEditingStage(stage);
    setIsDeleteDialogOpen(true);
  };

  const toggleAutoAdvance = (stageId: string) => {
    const updatedStages = localStages.map((stage) => {
      if (stage.id === stageId) {
        return {
          ...stage,
          autoAdvance: !stage.autoAdvance,
        };
      }
      return stage;
    });
    
    setLocalStages(updatedStages);
    onStagesChange(updatedStages);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Etapas do Pipeline</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Etapa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Etapa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label htmlFor="name">Nome da etapa</Label>
                  <Input
                    id="name"
                    value={newStage.name || ""}
                    onChange={(e) =>
                      setNewStage({ ...newStage, name: e.target.value })
                    }
                    placeholder="Ex: Qualificação"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Cor</Label>
                  <div className="mt-2">
                    <input
                      type="color"
                      id="color"
                      value={newStage.color || "#007BFF"}
                      onChange={(e) =>
                        setNewStage({ ...newStage, color: e.target.value })
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddStage}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stages">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="border rounded-md overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Avanço Automático</TableHead>
                    <TableHead className="w-10 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localStages.map((stage, index) => (
                    <Draggable
                      key={stage.id}
                      draggableId={stage.id}
                      index={index}
                    >
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TableCell>
                            <div
                              {...provided.dragHandleProps}
                              className="flex justify-center items-center cursor-move h-full"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{stage.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: stage.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {stage.color}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={stage.autoAdvance}
                                onCheckedChange={() => toggleAutoAdvance(stage.id)}
                              />
                              {stage.autoAdvance && (
                                <Badge variant="outline" className="ml-2">
                                  Configurado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEdit(stage)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configurar regras
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => startDelete(stage)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Stage Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Etapa</DialogTitle>
          </DialogHeader>
          {editingStage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label htmlFor="edit-name">Nome da etapa</Label>
                  <Input
                    id="edit-name"
                    value={editingStage.name}
                    onChange={(e) =>
                      setEditingStage({ ...editingStage, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Cor</Label>
                  <div className="mt-2">
                    <input
                      type="color"
                      id="edit-color"
                      value={editingStage.color}
                      onChange={(e) =>
                        setEditingStage({ ...editingStage, color: e.target.value })
                      }
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-advance">Avanço automático</Label>
                  <Switch
                    id="auto-advance"
                    checked={editingStage.autoAdvance}
                    onCheckedChange={(checked) =>
                      setEditingStage({ ...editingStage, autoAdvance: checked })
                    }
                  />
                </div>
                {editingStage.autoAdvance && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p className="mb-2 text-muted-foreground">
                      Configure regras de avanço automático nas configurações avançadas após salvar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditStage}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Tem certeza que deseja excluir a etapa{" "}
              <span className="font-semibold">
                {editingStage?.name}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStage}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineCustomization;
