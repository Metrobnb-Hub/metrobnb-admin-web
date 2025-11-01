import { u as useAuth } from './useAuth-DSXahgcj.mjs';
import { computed } from 'vue';

const useInvoiceWorkflow = () => {
  const { user } = useAuth();
  const isAdmin = computed(() => {
    var _a;
    return ["owner", "admin"].includes(((_a = user.value) == null ? void 0 : _a.role) || "");
  });
  const isPartner = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "partner";
  });
  const getInvoiceActions = (invoice) => {
    const actions = [];
    if (!(invoice == null ? void 0 : invoice.status)) return actions;
    switch (invoice.status) {
      case "draft":
        if (isPartner.value) {
          actions.push({
            label: "Approve Invoice",
            action: "approve",
            color: "green",
            icon: "i-heroicons-check-circle",
            requiresConfirmation: true,
            confirmationMessage: "Approve this invoice? Once approved, it will be finalized and ready to send."
          });
          actions.push({
            label: "Reject Invoice",
            action: "reject",
            color: "red",
            icon: "i-heroicons-x-circle",
            requiresConfirmation: true,
            confirmationMessage: "Reject this invoice? Please provide a reason for rejection."
          });
        } else if (isAdmin.value) {
          actions.push({
            label: "Refresh Data",
            action: "refresh",
            color: "gray",
            icon: "i-heroicons-arrow-path"
          });
          actions.push({
            label: "Finalize",
            action: "finalize",
            color: "blue",
            icon: "i-heroicons-lock-closed",
            requiresConfirmation: true,
            confirmationMessage: "Finalize this invoice? This will bypass partner approval and lock the invoice."
          });
        }
        break;
      case "finalized":
        if (isAdmin.value) {
          actions.push({
            label: "Send Invoice",
            action: "send",
            color: "purple",
            icon: "i-heroicons-paper-airplane",
            requiresConfirmation: true,
            confirmationMessage: "Send this invoice to the partner?"
          });
        }
        break;
      case "sent":
        if (isAdmin.value) {
          actions.push({
            label: "Mark as Paid",
            action: "settle",
            color: "green",
            icon: "i-heroicons-check-circle"
          });
        }
        break;
      case "paid":
        break;
      case "rejected":
        if (isAdmin.value) {
          actions.push({
            label: "Create New Draft",
            action: "refresh",
            color: "blue",
            icon: "i-heroicons-arrow-path",
            requiresConfirmation: true,
            confirmationMessage: "Create a new draft based on this rejected invoice?"
          });
        }
        break;
    }
    return actions;
  };
  const getStatusText = (status, isPartnerView = false) => {
    if (isPartnerView || isPartner.value) {
      const partnerStatusMap = {
        "draft": "Awaiting Your Approval",
        "finalized": "Approved & Ready",
        "sent": "Invoice Sent",
        "paid": "Payment Complete \u2713",
        "rejected": "Rejected by You",
        "cancelled": "Cancelled"
      };
      return partnerStatusMap[status] || status;
    } else {
      const adminStatusMap = {
        "draft": "Draft",
        "finalized": "Finalized",
        "sent": "Sent",
        "paid": "Paid",
        "rejected": "Rejected",
        "cancelled": "Cancelled"
      };
      return adminStatusMap[status] || status;
    }
  };
  const getStatusColor = (status) => {
    const colors = {
      "draft": "yellow",
      "finalized": "blue",
      "sent": "purple",
      "paid": "green",
      "rejected": "orange",
      "cancelled": "red"
    };
    return colors[status] || "gray";
  };
  const canPerformAction = (invoice, action) => {
    const availableActions = getInvoiceActions(invoice);
    return availableActions.some((a) => a.action === action);
  };
  const getNextStatus = (currentStatus, action) => {
    var _a;
    const statusFlow = {
      "draft": {
        "approve": "finalized",
        "finalize": "finalized",
        "refresh": "draft"
        // stays draft
      },
      "finalized": {
        "send": "sent"
      },
      "sent": {
        "settle": "paid"
      }
    };
    return ((_a = statusFlow[currentStatus]) == null ? void 0 : _a[action]) || currentStatus;
  };
  const validateTransition = (invoice, action) => {
    var _a;
    if (!invoice) {
      return { valid: false, error: "Invoice not found" };
    }
    const userRole = (_a = user.value) == null ? void 0 : _a.role;
    if ((action === "approve" || action === "reject") && userRole !== "partner") {
      return { valid: false, error: "Only partners can approve or reject invoices" };
    }
    if (["refresh", "finalize", "send", "settle"].includes(action) && !["owner", "admin"].includes(userRole || "")) {
      return { valid: false, error: "Only admins can perform this action" };
    }
    if ((action === "approve" || action === "reject") && invoice.status !== "draft") {
      return { valid: false, error: "Can only approve or reject draft invoices" };
    }
    if (action === "finalize" && invoice.status !== "draft") {
      return { valid: false, error: "Can only finalize draft invoices" };
    }
    if (action === "send" && invoice.status !== "finalized") {
      return { valid: false, error: "Can only send finalized invoices" };
    }
    if (action === "settle" && invoice.status !== "sent") {
      return { valid: false, error: "Can only settle sent invoices" };
    }
    return { valid: true };
  };
  return {
    isAdmin,
    isPartner,
    getInvoiceActions,
    getStatusText,
    getStatusColor,
    canPerformAction,
    getNextStatus,
    validateTransition
  };
};

export { useInvoiceWorkflow as u };
//# sourceMappingURL=useInvoiceWorkflow-CqbO3mO3.mjs.map
