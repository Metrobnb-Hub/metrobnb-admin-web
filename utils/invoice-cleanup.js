// Invoice cleanup script
// Run this in browser console on /invoices page

async function cleanupInvoices() {
  const { getInvoices, deleteInvoice, updateInvoice } = useApi()
  
  try {
    // Get all invoices
    const result = await getInvoices()
    const invoices = result.items || result
    
    
    // Find target invoices
    const raizaInvoice = invoices.find(inv => inv.invoice_number === 'INV-2025-014' && inv.partner_name === 'Raiza Paras')
    const paulInvoice = invoices.find(inv => inv.invoice_number === 'INV-2025-013' && inv.partner_name === 'Paul Halog')
    
    if (!raizaInvoice || !paulInvoice) {
      return
    }
    
    
    // Delete all other invoices
    const toDelete = invoices.filter(inv => 
      inv.id !== raizaInvoice.id && inv.id !== paulInvoice.id
    )
    
    
    for (const invoice of toDelete) {
      try {
        await deleteInvoice(invoice.id)
      } catch (error) {
      }
    }
    
    // Update invoice numbers
    
    try {
      await updateInvoice(raizaInvoice.id, { invoice_number: 'INV-2025-001' })
    } catch (error) {
    }
    
    try {
      await updateInvoice(paulInvoice.id, { invoice_number: 'INV-2025-002' })
    } catch (error) {
    }
    
    
  } catch (error) {
  }
}

// Run the cleanup
cleanupInvoices()