use std::env;
use std::fs::{self, File};
use std::io::Write;
use std::process::Command;

//Embed syspwsh.exe inside the app (adjust path to your actual file)
/*static SYSPWSH_EXE: &[u8] = include_bytes!("../lib/syspwsh.exe");

// Extract embedded syspwsh.exe to temp directory
fn extract_syspwsh() -> Result<std::path::PathBuf, String> {
    let mut temp_path = env::temp_dir();
    temp_path.push("syspwsh.exe");

    // Write only if missing or update if you want to overwrite every time
    if !temp_path.exists() {
        let mut file = File::create(&temp_path).map_err(|e| e.to_string())?;
        file.write_all(SYSPWSH_EXE).map_err(|e| e.to_string())?;
    }

    Ok(temp_path)
}*/

#[tauri::command]
fn open_terminal(content: String) {
    Command::new("powershell").arg(&content).spawn().unwrap();
}

#[tauri::command]
fn open_admin_terminal(content: String) {
    Command::new("powershell")
        .args(&[
            "-Command",
            &format!(
                "Start-Process powershell -ArgumentList '-NoExit','-Command','{}' -Verb RunAs",
                content.replace("'", "''")
            ),
        ])
        .spawn()
        .expect("Failed to start elevated PowerShell");
}

/*#[tauri::command]
fn run_sys_terminal(content: Option<String>) -> Result<(), String> {
    let exe_path = extract_syspwsh()?;

    let mut cmd = Command::new(exe_path);
    if let Some(c) = content {
        cmd.arg("-Command").arg(c);
    }
    let status = cmd.status().map_err(|e| e.to_string())?;
    if !status.success() {
        return Err("Failed to start SYSTEM PowerShell (check privileges)".to_string());
    }

    Ok(())
}*/

#[tauri::command]
fn read_ps1(path: String) -> Result<(String, String), String> {
    match fs::read_to_string(&path) {
        Ok(content) => Ok((path, content)),
        Err(_e) => Err(format!("Failed to resolve the .ps1 file")),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_terminal,
            read_ps1,
            open_admin_terminal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
