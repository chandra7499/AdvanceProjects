import { notifyAvailableTemplate } from "./notifyAvailable";
import { orderPlacedTemplate } from "./orderPlaced";
import { genericTemplate } from "./generic";

export const EMAIL_TEMPLATES = {
  "notify_available": notifyAvailableTemplate,
  "order_placed": orderPlacedTemplate,
  "generic": genericTemplate,
};

export function getEmailTemplate(type, data) {
  const templateFn = EMAIL_TEMPLATES[type];
  if (!templateFn) throw new Error("Invalid email type");
  return templateFn(data);
}
