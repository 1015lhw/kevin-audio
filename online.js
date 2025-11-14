// === 初始化 supabase ===
const supabaseUrl = "https://sjgmncmlqjpizioxbtboo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZ21uY21scWpwdGl6b3h0Ym9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNjkwOTksImV4cCI6MjA3ODY0NTA5OX0.vWSV4KLi8e1INuvrcjDFIWrjYpjR5ffx35XQa_Fhmkg";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// === 生成访客 ID（存 LocalStorage）===
let userId = localStorage.getItem("kevin_user_id");
if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("kevin_user_id", userId);
}

// === 更新在线状态（20秒一次）===
async function updateOnlineStatus() {
    await supabase
        .from("online_users")
        .upsert([{ id: userId, last_active: new Date().toISOString() }]);
}
setInterval(updateOnlineStatus, 20000);
updateOnlineStatus();

// === 查询在线人数（最近 2 分钟）===
async function refreshCounter() {
    const { data, error } = await supabase
        .from("online_users")
        .select("*")
        .gte("last_active", new Date(Date.now() - 2 * 60 * 1000).toISOString());

    const el = document.getElementById("onlineCounter");
    if (el) el.innerText = `目前有 ${data.length} 位玩家在此游玩中～`;
}
setInterval(refreshCounter, 15000);
refreshCounter();
