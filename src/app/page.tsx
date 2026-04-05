import Image from "next/image";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-20 px-6 sm:px-12 z-10">
        <div className="flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-widest leading-none">
              Authorized to Act
            </span>
          </div>

          <div className="flex flex-col gap-6 max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.1]">
              Apply <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Agent</span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Analyze job descriptions and securely automate your applications using the power of Auth0's Token Vault.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            {user ? (
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/20">
                    <Image
                      src={user.picture || "/default-avatar.png"}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <a
                    href="/dashboard"
                    className="flex h-14 px-8 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
                  >
                    Go to Dashboard
                  </a>
                  <a
                    href="/api/auth/logout"
                    className="flex h-14 px-8 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold text-lg transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.98]"
                  >
                    Logout
                  </a>
                </div>
              </div>
            ) : (
              <a
                href="/api/auth/login"
                className="flex h-16 sm:min-w-[240px] px-10 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
              >
                Log In to Start
              </a>
            )}
          </div>
        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-32 w-full">
          {[
            {
              title: "Smart Analysis",
              desc: "Deep-dives into job descriptions to match your skills.",
              icon: "🔍"
            },
            {
              title: "Secure Automation",
              desc: "Uses Auth0 Token Vault for zero-trust API interactions.",
              icon: "🛡️"
            },
            {
              title: "Human in the Loop",
              desc: "You control exactly what and when to send.",
              icon: "👥"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-zinc-900 dark:text-white">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-8 px-12 border-t border-zinc-200 dark:border-zinc-800 text-center sm:text-left z-10 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <p className="text-sm text-zinc-500 dark:text-zinc-600">
          Built for the <span className="font-semibold text-zinc-900 dark:text-zinc-300">Authorized to Act</span> Hackathon.
        </p>
      </footer>
    </div>
  );
}
