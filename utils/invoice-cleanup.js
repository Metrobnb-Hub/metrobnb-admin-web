// Invoice cleanup script
// Run this in browser console on /invoices page

async function cleanupInvoices() {
  const { getInvoices, deleteInvoice, updateInvoice } = useApi()
  
  try {
    // Get all invoices
    const result = await getInvoices()
    const invoices = result.items || result
    
    console.log('Found invoices:', invoices.length)
    
    // Find target invoices
    const raizaInvoice = invoices.find(inv => inv.invoice_number === 'INV-2025-014' && inv.partner_name === 'Raiza Paras')
    const paulInvoice = invoices.find(inv => inv.invoice_number === 'INV-2025-013' && inv.partner_name === 'Paul Halog')
    
    if (!raizaInvoice || !paulInvoice) {
      console.error('Target invoices not found')
      console.log('Raiza found:', !!raizaInvoice)
      console.log('Paul found:', !!paulInvoice)
      return
    }
    
    console.log('Target invoices found:', raizaInvoice.id, paulInvoice.id)
    
    // Delete all other invoices
    const toDelete = invoices.filter(inv => 
      inv.id !== raizaInvoice.id && inv.id !== paulInvoice.id
    )
    
    console.log('Deleting', toDelete.length, 'invoices...')
    
    for (const invoice of toDelete) {
      try {
        await deleteInvoice(invoice.id)
        console.log('Deleted:', invoice.invoice_number)
      } catch (error) {
        console.error('Failed to delete:', invoice.invoice_number, error)
      }
    }
    
    // Update invoice numbers
    console.log('Updating invoice numbers...')
    
    try {
      await updateInvoice(raizaInvoice.id, { invoice_number: 'INV-2025-001' })
      console.log('Updated Raiza to INV-2025-001')
    } catch (error) {
      console.error('Failed to update Raiza invoice:', error)
    }
    
    try {
      await updateInvoice(paulInvoice.id, { invoice_number: 'INV-2025-002' })
      console.log('Updated Paul to INV-2025-002')
    } catch (error) {
      console.error('Failed to update Paul invoice:', error)
    }
    
    console.log('Cleanup complete! Refresh the page.')
    
  } catch (error) {
    console.error('Cleanup failed:', error)
  }
}

// Run the cleanup
cleanupInvoices()