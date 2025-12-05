import { supabase } from './supabaseClient';
import { Workspace, WorkspaceMember, WorkspaceInvitation } from '../types';

export async function getUserWorkspaces(userId: string): Promise<{ data: Workspace[] | null; error?: string }> {
  try {
    const { data: memberships, error: memberError } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId);

    if (memberError) {
      console.error('Error loading workspace memberships:', memberError);
      return { data: null, error: memberError.message };
    }

    if (!memberships || memberships.length === 0) {
      return { data: [] };
    }

    const workspaceIds = memberships.map(m => m.workspace_id);

    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .in('id', workspaceIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading workspaces:', error);
      return { data: null, error: error.message };
    }

    const workspaces: Workspace[] = (data || []).map(record => ({
      id: record.id,
      name: record.name,
      createdBy: record.created_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));

    return { data: workspaces };
  } catch (err) {
    console.error('Error loading workspaces:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function createWorkspace(
  userId: string,
  name: string
): Promise<{ success: boolean; workspace?: Workspace; error?: string }> {
  try {
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name,
        created_by: userId,
      })
      .select()
      .single();

    if (workspaceError) {
      console.error('Error creating workspace:', workspaceError);
      return { success: false, error: workspaceError.message };
    }

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: userId,
        role: 'owner',
      });

    if (memberError) {
      console.error('Error adding workspace member:', memberError);
      return { success: false, error: memberError.message };
    }

    return {
      success: true,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        createdBy: workspace.created_by,
        createdAt: workspace.created_at,
        updatedAt: workspace.updated_at,
      },
    };
  } catch (err) {
    console.error('Error creating workspace:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<{ data: WorkspaceMember[] | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error loading workspace members:', error);
      return { data: null, error: error.message };
    }

    const members: WorkspaceMember[] = (data || []).map(record => ({
      id: record.id,
      workspaceId: record.workspace_id,
      userId: record.user_id,
      role: record.role,
      joinedAt: record.joined_at,
      createdAt: record.created_at,
    }));

    return { data: members };
  } catch (err) {
    console.error('Error loading workspace members:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function createInvitation(
  workspaceId: string,
  userId: string
): Promise<{ success: boolean; invitation?: WorkspaceInvitation; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: workspaceId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      invitation: {
        id: data.id,
        workspaceId: data.workspace_id,
        invitationToken: data.invitation_token,
        createdBy: data.created_by,
        expiresAt: data.expires_at,
        usedAt: data.used_at,
        usedBy: data.used_by,
        createdAt: data.created_at,
      },
    };
  } catch (err) {
    console.error('Error creating invitation:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function getInvitationByToken(
  token: string
): Promise<{ data: WorkspaceInvitation | null; workspace?: Workspace; error?: string }> {
  try {
    const { data: invitation, error: inviteError } = await supabase
      .from('workspace_invitations')
      .select('*')
      .eq('invitation_token', token)
      .maybeSingle();

    if (inviteError) {
      console.error('Error loading invitation:', inviteError);
      return { data: null, error: inviteError.message };
    }

    if (!invitation) {
      return { data: null, error: 'Invitation not found' };
    }

    if (invitation.used_at) {
      return { data: null, error: 'Invitation has already been used' };
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return { data: null, error: 'Invitation has expired' };
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', invitation.workspace_id)
      .single();

    if (workspaceError) {
      console.error('Error loading workspace:', workspaceError);
      return { data: null, error: workspaceError.message };
    }

    return {
      data: {
        id: invitation.id,
        workspaceId: invitation.workspace_id,
        invitationToken: invitation.invitation_token,
        createdBy: invitation.created_by,
        expiresAt: invitation.expires_at,
        usedAt: invitation.used_at,
        usedBy: invitation.used_by,
        createdAt: invitation.created_at,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        createdBy: workspace.created_by,
        createdAt: workspace.created_at,
        updatedAt: workspace.updated_at,
      },
    };
  } catch (err) {
    console.error('Error loading invitation:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function acceptInvitation(
  token: string,
  userId: string
): Promise<{ success: boolean; workspaceId?: string; error?: string }> {
  try {
    const { data: invitation, workspace, error: getError } = await getInvitationByToken(token);

    if (getError || !invitation || !workspace) {
      return { success: false, error: getError || 'Invalid invitation' };
    }

    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', invitation.workspaceId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingMember) {
      return { success: false, error: 'You are already a member of this workspace' };
    }

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: invitation.workspaceId,
        user_id: userId,
        role: 'member',
      });

    if (memberError) {
      console.error('Error adding workspace member:', memberError);
      return { success: false, error: memberError.message };
    }

    const { error: updateError } = await supabase
      .from('workspace_invitations')
      .update({
        used_at: new Date().toISOString(),
        used_by: userId,
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
    }

    return { success: true, workspaceId: invitation.workspaceId };
  } catch (err) {
    console.error('Error accepting invitation:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function leaveWorkspace(
  workspaceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error leaving workspace:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error leaving workspace:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function updateWorkspaceName(
  workspaceId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('workspaces')
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workspaceId);

    if (error) {
      console.error('Error updating workspace:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error updating workspace:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
