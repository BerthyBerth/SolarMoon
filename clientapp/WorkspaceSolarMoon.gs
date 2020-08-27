Hash = function(value)
	amountBlocks = floor(value.len / 2)
	clockBlock = 0
	currentCharIndex = 1
	currentBlockValue = 0
	hashedValue = ""
	for i in value
		clockBlock = clockBlock + 1
		if clockBlock >= 3 then
			if (value % 2) != 0 and currentCharIndex == value.len then
				currentBlockValue = currentBlockValue + i.code
				hashedValue = hashedValue + str(currentBlockValue)
			else
				clockBlock = 1
				hashedValue = hashedValue + str(currentBlockValue)
				currentBlockValue = i.code
			end if
		else
			currentBlockValue = currentBlockValue + i.code
			if currentCharIndex == value.len then
				hashedValue = hashedValue + currentBlockValue
			end if
		end if
		currentCharIndex = currentCharIndex + 1
	end for
	return hashedValue
end function

if params == null or params.len < 2 then exit("<b>usage: </b>workspace <username> <password>")
if active_user != "root" then exit("Please run this program as root")

username = params[0]
password = params[1]

// ----------------------

ClearLogs = function()
	
	get_shell.host_computer.File("/var/system.log").delete
	
end function

serverIp = "182.68.204.78"
serverUser = "root"
serverPort = 22
serverPassword = "Ruture"
serverService = "ssh"

if active_user != "root" then exit("Please run this app as root")

server = get_shell.connect_service(serverIp, serverPort, serverUser, serverPassword, serverService)
ClearLogs()

// ----------------------

GetUserInfos = function(userName)
	
	userFile = server.host_computer.File("/Workspace/users/" + userName.lower + "/data")
	if userFile == null then
		return null
	end if
	
	userInfos = userFile.content.split("\n") 
	return userInfos
	
end function

GetSpecificUserInfo = function(username, dataName)

    userInfos = GetUserInfos(username)
    for data in userInfos
        dataSplited = data.split(":")
        if dataSplited[0].lower == dataName.lower then
            return dataSplited[1]
        end if
    end for

    // Case if the data name given has not been found
    return null

end function

// ----------------------

MainMenu = function()

	userWorkspaces = server.host_computer.File("/Workspace/users/" + username.lower + "/workspaces").content.split("\n") 

    print("\n<b><u><size=19>Workspaces - " + username + "</size></u></b>")
    for i in range(0, userWorkspaces.len - 1)
        print("<b>[" + (i + 1) + "]</b> " + userWorkspaces[i])
    end for
    print("<b>[" + (userWorkspaces.len + 1) + "]</b> " + "Exit")

	mainMenuChoice = user_input("Choice : ").to_int
	if mainMenuChoice >= 1 and mainMenuChoice <= userWorkspaces.len then
		print("Opening " + userWorkspaces[mainMenuChoice - 1] + "...")
		OpenWorkspace(userWorkspaces[mainMenuChoice - 1])
	else if mainMenuChoice == userWorkspaces.len + 1 then
		exit("Have a good day !")
	else
		print("\n<u>Invalid choice</u>")
		MainMenu()
	end if

end function

// ----------------------

OpenWorkspace = function(workspace)

	print("\n<b><u><size=19>" + workspace + "</u></b></size>")
	workspaceMainFolder = server.host_computer.File("/Workspace/workspaces/" + "workspace")
	if workspaceMainFolder == null then
		exit("<b><u>Workspace not found, please contact an admin.</u></b>")
	end if
	workspaceFiles = workspaceMainFolder.get_files

	print("Choose wich file you want to edit.")
	for i in range(1, workspaceFiles.len)
		print("<b>[" + (i + 1) + "]</b> " + workspaceFiles[i - 1].name)
	end for

	print("<b>[" + workspaceFiles.len + "]</b> Create file") // Option to create a file
	print("<b>[" + (workspaceFiles.len + 1) + "]</b> Download all the workspace")
	print("<b>[" + (workspaceFiles.len + 2) + "]</b> Return to main menu file") // Option to return to main menu

	choice = user_input("Choice : ").to_int

	if choice >= 1 and choice <= workspaceFiles.len then
		ManipulateFile(workspace, workspaceFiles[choice - 1])
	else if choice == workspaceFiles.len then
		newFileName = user_input("New file's name : ")
		server.host_computer.touch("/Workspace/workspaces/" + workspace + "/", newFileName)
		OpenWorkspace(workspace)
	else if choice == workspaceFiles.len + 1 then
		for workspaceFile in workspaceFiles
			DownloadFile(workspace, workspaceFile)
		end for
	else if choice == workspaceFiles.len + 2 then
		MainMenu()
	else
		print("Not a valid choice.")
		OpenWorkspace(workspace)
	end if

end function

ManipulateFile = function(workspace, file)

	print("<b>[1]</b> Read file")
	print("<b>[2]</b> Delete file file")
	print("<b>[3]</b> Download file")
	print("<b>[4]</b> Return to workspace menu")

	choice = user_input("Choice : ").to_int

	if choice >= 1 and choice <= 4 and typeof(choice) == number then
		if choice == 1 then
			print("<size=19><u><b>" + file.name + "</u></b></size>")
			prnt(file.content)
			
			ManipulateFile(workspace, file)
		else if choice == 2 then
			userSureToDelete = user_input("Are you sure you want to delete " + file.name + " ? ").lower
			if userSureToDelete == "y" or userSureToDelete == "yes" then
				server.host_computer.File(file.path).delete
			else
				ManipulateFile(workspace, file)
			end if
		else if choice == 3 then
			DownloadFile(workspace, file)
		else if choice == 4 then
			OpenWorkspace(workspace)
		else
			exit("<color=red><u><b>There has been an error</b></u></color>")
		end if
	else
		print("Not a valid choice.")
		ManipulateFile(workspace, file)
	end if

end function

DownloadFile = function(workspace, file)

	clientComputer = get_shell.host_computer

	if clientComputer.File("/Workspace/" + file.name) == null then
		clientComputer.create_folder("/Workspace/", workspace)
	end if

	server.scp_upload("/Workspace/workspaces/" + workspace + "/" + file.name, "/Workspace/" + workspace + "/")
	print("<u><b>\nDownload complete !</b></u>")
	ManipulateFile(workspace, file)

end function

// ----------------------

// ----------------------
// Starting the software

userDataFile = server.host_computer.File("/Workspace/users/" + username.lower + "/data")
if GetSpecificUserInfo(username, "password") == Hash(password) then
	MainMenu()
else
	exit("<b><u>Wrong account informations.</u></b>")
end if
