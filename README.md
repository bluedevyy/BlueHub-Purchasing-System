Go To .env and config everything in there & then do npm install after that do node server.js then your done There No provided Hub with This But We Give The Whitelist Code & Main Hub Code:

Written below is a ModuleScript that you may use to make coding your hub easier. Setting it up should be easy, but please ensure that this script is inside ServerScriptService, as it contains confidential information. It is not recommended to edit the script in any other place than the URL variable and the Key variable.

--[[
	ROBLOX-HubModule
	Please do not edit below! This script should be obfuscated to increase security.
--]]

local URL = ""; -- IP:PORT or Defined URL
local Key = ""; -- API Key defined in your .env file

--[[				// Functions \\
	--------------
	 GetStatus() returns true/false (Is it running?)
	--------------
	 GetUserProducts([User ID]) returns Array[Products]
	--------------
	 GetVerifyStatus([User ID]) returns 'link'/'complete'
	--------------
	 GetLinkCode([User ID]) returns Link Code (Returns false if verified)
	--------------
	 WaitForVerify([User ID]) returns void (Returns when user is verified)
	--------------
	 GetAllProducts() returns Array[Products]
	--------------
	 WhitelistUser([Product ID], [User ID]) returns true/false (Did the delivery DM succeed?)
	--------------
	 RevokeUser([Product ID], [User ID]) returns void
	--------------
--]]

local Success,Error = pcall(function()
	if game.Players.LocalPlayer ~= nil then
		game.Players.LocalPlayer:Kick("HUB | You must not have this Module stored locally!");
	end;
end);
if not script:IsDescendantOf(game.ServerScriptService) then
	error("HUB | You must have this Module this in ServerScriptService!");
end;
function GetURL(Endpoint)
	return 'http://'..URL..Endpoint.."?key="..Key;
end;
local HttpService = {
	GetAsync = function(ResURL)
		local Request = game:GetService('HttpService'):RequestAsync({
			Url = ResURL;
			Method = "GET";
		});
		if not Request.Success then
			return nil;
		else
			return Request.StatusCode, game:GetService('HttpService'):JSONDecode(Request.Body);
		end;
	end;
};
local Module = {};
Module.GetStatus = function(ID)
	local RetVal = false;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/'));
		if not Data then
			RetVal = false;
		end;
		if Data.running == true then
			RetVal = true;
		end;
	end)
	return RetVal
end;
Module.GetUserProducts = function(ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
		RetVal = Data.value.products;
	end)
	return RetVal
end;
Module.GetVerifyStatus = function(ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
		RetVal = Data.value.verify.status;
	end)
	return RetVal
end;
Module.GetLinkCode = function(ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
		if Data.value.verify.status == 'link' then
			RetVal = Data.value.verify.value;
		else
			RetVal = false;
		end;
	end)
	return RetVal
end;
Module.WaitForVerify = function(ID)
	local s = pcall(function()
		while true do
			local Status, Data = HttpService.GetAsync(GetURL('/user/'..ID));
			if Data.value.verify.status == 'complete' then
				break;
			end;
			wait(2);
		end;
	end)
end;
Module.GetAllProducts = function(ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/products'));
		RetVal = Data.products;
	end)
	return RetVal
end;
Module.WhitelistUser = function(Product, ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/products/give/'..Product..'/'..ID));
		RetVal = Data.dm;
	end)
	return RetVal
end;
Module.RevokeUser = function(Product, ID)
	local RetVal = nil;
	local s = pcall(function()
		local Status, Data = HttpService.GetAsync(GetURL('/products/revoke/'..Product..'/'..ID));
	end)
	return RetVal
end;
return Module;
Checking the Whitelist
Written below is a Whitelist Checker that you may use to check whitelists. Setting it up should be easy, but please ensure that this script is directly inside the main folder, as it will destroy the parent of the script when loading. It is recommended that all server-side code is stored in this whitelist script and this whitelist script is obfuscated, so that no one can remove this script and have it still run entirely.

--[[
    ROBLOX-Whitelist
    Please do not edit below! This script should be obfuscated to increase security.
--]]

-- PRODUCT SETUP
local ProductId = ""
local URL = "" -- "IP:Port"

local UnloadProduct = function()
	-- Insert code here to unload the product.
	warn("["..string.upper(ProductId).."] Unloaded!")
end
local LoadProduct = function()
	-- Insert code here to load the product.
	warn("["..string.upper(ProductId).."] Loaded!")
end

-- WHITELIST CHECK
local Http = game:GetService("HttpService")
warn("["..string.upper(ProductId).."] Loading...")
local HTTPInfoEncoded = ""
local HttpEnabled, HttpError = pcall(function()
	HTTPInfoEncoded = Http:GetAsync("http://"..URL.."/game/"..ProductId.."/?job=a"..game.JobId)
end)
if HttpEnabled == false and HttpError == "Http requests are not enabled. Enable via game settings" then
	warn("["..string.upper(ProductId).."] Please enable HTTP Services.")
	spawn(UnloadProduct)
	return
elseif HttpEnabled == false then
	warn("["..string.upper(ProductId).."] There was an issue connecting to the server. ("..HttpError..")")
	spawn(UnloadProduct)
	return
end
local HTTPInfo = Http:JSONDecode(HTTPInfoEncoded)
if HTTPInfo.status == "error" then
	warn("["..string.upper(ProductId).."] "..HTTPInfo.error)
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
elseif HTTPInfo.owned == false then
	warn("["..string.upper(ProductId).."] User does not own product.")
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
elseif game:GetService('RunService'):IsStudio() then
	warn("["..string.upper(ProductId).."] Products do not work in Studio.")
	local s, e = pcall(UnloadProduct)
	if not s then
		warn("["..string.upper(ProductId).."] Error while unloading: "..e)
	end
	script:Destroy()
	return
end
local s, e = pcall(LoadProduct)
if not s then
	warn("["..string.upper(ProductId).."] Error while loading: "..e)
end
-- For security measures, it is suggested that you add script:Destroy() here.
return