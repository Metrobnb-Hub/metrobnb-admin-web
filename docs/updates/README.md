# MetroBNB Frontend Updates

This directory contains versioned update logs for the MetroBNB frontend application.

## Update Format
Each update file follows the naming convention: `vX.Y.Z-YYYY-MM-DD.md`

## Current Updates
- [v1.0.0 - Initial API Integration (2024-12-19)](./v1.0.0-2024-12-19.md) ✅ **READY FOR GIT COMMIT**

## How to Generate Updates
When you want to create a new update log, just ask me to "generate an update" and I'll:
1. Create a new versioned markdown file
2. Document all changes since the last update
3. Include breaking changes, new features, and bug fixes
4. Update this README with the new version

## Git Commit Message
```bash
git commit -m "feat: Complete API integration with pagination and null safety

- Backend API integration with field conversion
- Services CRUD management
- Expense billable field support
- Invoice pagination for large datasets
- Comprehensive null safety improvements
- Print-friendly invoice layout

Breaking: Partners use Service objects, Expenses require billable field"
```

## Version Numbering
- **Major (X.0.0)**: Breaking changes or major feature additions
- **Minor (X.Y.0)**: New features, non-breaking changes
- **Patch (X.Y.Z)**: Bug fixes, small improvements