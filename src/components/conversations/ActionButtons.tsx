
import React from "react";
import { Contact } from "@/types/crm";
import PriorityButton from "./action-buttons/PriorityButton";
import ScheduleButton from "./action-buttons/ScheduleButton";
import TagsPopover from "./action-buttons/TagsPopover";
import StatusPopover from "./action-buttons/StatusPopover";
import AssignPopover from "./action-buttons/AssignPopover";

interface ActionButtonsProps {
  contact: Contact;
  onUpdateContact?: (updatedContact: Partial<Contact>) => void;
}

const ActionButtons = ({ contact, onUpdateContact }: ActionButtonsProps) => {
  return (
    <div className="flex gap-1">
      <PriorityButton contact={contact} onUpdateContact={onUpdateContact} />
      <ScheduleButton />
      <TagsPopover contact={contact} onUpdateContact={onUpdateContact} />
      <StatusPopover contact={contact} onUpdateContact={onUpdateContact} />
      <AssignPopover contact={contact} onUpdateContact={onUpdateContact} />
    </div>
  );
};

export default ActionButtons;
