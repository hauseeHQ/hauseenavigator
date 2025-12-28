/*
  # Drop Duplicate Constraint

  1. Performance Improvements
    - Remove duplicate unique constraint on workspace_invitations table
    - Keep workspace_invitations_token_idx and drop the constraint
  
  2. Constraint Removed
    - workspace_invitations_invitation_token_key (duplicate unique constraint)
*/

-- Drop the duplicate unique constraint (which will also drop the associated index)
ALTER TABLE workspace_invitations 
  DROP CONSTRAINT IF EXISTS workspace_invitations_invitation_token_key;