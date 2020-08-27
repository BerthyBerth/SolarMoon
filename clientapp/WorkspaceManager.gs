WorkspaceMenu = function()

    userWorkspaces = ["test", "test", "test"]    

    print("\n<b><u><size=19>Workspaces</size></u></b>")

    for i in range(0, userWorkspaces.len - 1)
        print("<b>[" + (i + 1) + "]</b> " + userWorkspaces[i])
    end for

    print("<b>[" + (userWorkspaces.len + 1) + "]</b> " + "Exit")

end function

WorkspaceMenu()