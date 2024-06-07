#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{AppHandle, Manager};

#[tauri::command]
fn show_secondary_window(app_handle: AppHandle) {
    if let Some(secondary_window) = app_handle.get_window("timer") {
        secondary_window.show().unwrap();
        secondary_window.set_focus().unwrap();
    }
}

#[tauri::command]
fn get_window_label(window: tauri::Window) -> String {
    window.label().to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![show_secondary_window, get_window_label])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
