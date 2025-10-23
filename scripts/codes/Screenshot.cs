// 创建这个脚本，挂在任意 GameObject 上
using UnityEngine;
using System.IO;

public class Screenshot : MonoBehaviour
{
    [Header("截屏设置")]
    public KeyCode screenshotKey = KeyCode.F12;
    public int superSize = 1; // 1 = 原始分辨率, 2 = 2倍分辨率
    
    void Update()
    {
        if (Input.GetKeyDown(screenshotKey))
        {
            TakeScreenshot();
        }
    }
    
    void TakeScreenshot()
    {
        string folderPath = Path.Combine(Application.dataPath, "..", "Screenshots");
        
        // 创建文件夹
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }
        
        // 生成文件名
        string fileName = $"Screenshot_{System.DateTime.Now:yyyy-MM-dd_HH-mm-ss}.png";
        string filePath = Path.Combine(folderPath, fileName);
        
        // 截图
        ScreenCapture.CaptureScreenshot(filePath, superSize);
        
        Debug.Log($"截图已保存: {filePath}");
    }
}