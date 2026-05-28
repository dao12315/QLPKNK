import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  User,
  Bell,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/layouts/AdminLayout";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const sections = [
    {
      title: "Account & Security",
      items: [
        {
          label: "Change Password",
          desc: "Update your login credentials",
          icon: <ShieldCheck size={20} className="text-primary" />,
          action: () => navigate("/profile/change-password"),
          isToggle: false,
        },
        {
          label: "Personal Information",
          desc: "Update your name and contact details",
          icon: <User size={20} className="text-blue" />,
          isToggle: false,
        },
      ],
    },
    {
      title: "System Preferences",
      items: [
        {
          label: "Notifications",
          desc: "Manage your alert preferences",
          icon: <Bell size={20} className="text-orange" />,
          isToggle: false,
        },
        {
          label: "Language",
          desc: "English (US)",
          icon: <Globe size={20} className="text-green" />,
          isToggle: false,
        },
        {
          label: "Dark Mode",
          desc: "Toggle visual appearance",
          icon: <Moon size={20} className="text-purple" />,
          isToggle: true,
        },
      ],
    },
  ];

  return (
    <AdminLayout title="System Settings">
      <div className="settings-page">
        <div className="settings-container max-w-4xl">
          {sections.map((section, idx) => (
            <div key={idx} className="settings-section">
              <h2 className="section-title">{section.title}</h2>

              <div className="settings-card card shadow-sm">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className={`settings-item ${item.action ? "clickable" : ""}`}
                    onClick={() => {
                      if (item.action) item.action();
                    }}
                  >
                    <div className="item-left">
                      <div className="item-icon">{item.icon}</div>

                      <div className="item-info">
                        <span className="item-label">{item.label}</span>
                        <span className="item-desc">{item.desc}</span>
                      </div>
                    </div>

                    <div className="item-right">
                      {item.isToggle ? (
                        <button
                          type="button"
                          className={`theme-toggle ${darkMode ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDarkMode((prev) => !prev);
                          }}
                        >
                          <span className="toggle-icon left">
                            <Sun size={16} />
                          </span>

                          <span className="toggle-icon right">
                            <Moon size={16} className="text-purple" />
                          </span>

                          <span className="toggle-thumb">
                            {darkMode && (
                              <Check size={16} className="text-purple" />
                            )}
                          </span>
                        </button>
                      ) : (
                        <ChevronRight size={18} className="text-muted" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .settings-page { padding-bottom: 3rem; }

            .settings-container {
              display: flex;
              flex-direction: column;
              gap: 2.5rem;
            }

            .section-title {
              font-size: 0.75rem;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: var(--neutral-400);
              margin-bottom: 0.75rem;
              padding-left: 0.5rem;
            }

            .settings-card {
              padding: 0.5rem;
              background: white;
              border-radius: 1.25rem;
              border: 1px solid var(--neutral-100);
            }

            .settings-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 1rem 1.25rem;
              border-radius: 0.875rem;
              transition: background 0.2s;
            }

            .settings-item.clickable {
              cursor: pointer;
            }

            .settings-item.clickable:hover {
              background: var(--neutral-50);
            }

            .item-left {
              display: flex;
              align-items: center;
              gap: 1.25rem;
            }

            .item-icon {
              width: 2.5rem;
              height: 2.5rem;
              background: var(--neutral-50);
              border-radius: 0.75rem;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .item-info {
              display: flex;
              flex-direction: column;
            }

            .item-label {
              font-size: 0.9375rem;
              font-weight: 700;
              color: var(--neutral-900);
            }

            .item-desc {
              font-size: 0.75rem;
              color: var(--neutral-500);
              font-weight: 500;
            }

            .text-primary { color: var(--primary-color); }
            .text-blue { color: #3b82f6; }
            .text-green { color: #22c55e; }
            .text-orange { color: #f97316; }
            .text-purple { color: #a855f7; }
            .text-muted { color: var(--neutral-300); }

            .theme-toggle {
              position: relative;
              width: 3.25rem;
              height: 1.75rem;
              border: none;
              border-radius: 999px;
              cursor: pointer;
              background: var(--neutral-200);
              transition: background 0.25s ease;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .theme-toggle.active {
              background: var(--primary-color);
            }

            .toggle-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              color: white;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .toggle-icon.left {
              left: 0.45rem;
            }

            .toggle-icon.right {
              right: 0.45rem;
            }

            .toggle-thumb {
              position: absolute;
              top: 3px;
              left: 3px;
              width: 1.375rem;
              height: 1.375rem;
              background: white;
              border-radius: 999px;
              transition: transform 0.25s ease;
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--primary-color);
              box-shadow: 0 2px 6px rgba(0,0,0,0.18);
            }

            .theme-toggle.active .toggle-thumb {
              transform: translateX(1.5rem);
            }

            html.dark body {
              background: #0f172a;
              color: #e5e7eb;
            }

            html.dark .settings-card {
              background: #111827;
              border-color: #1f2937;
            }

            html.dark .settings-item.clickable:hover {
              background: #1f2937;
            }

            html.dark .item-icon {
              background: #1f3729;
            }

            html.dark .item-label {
              color: #f9fafb;
            }

            html.dark .item-desc {
              color: #9ca3af;
            }

            html.dark .section-title {
              color: #9ca3af;
            }
          `,
        }}
      />
    </AdminLayout>
  );
};

export default SettingsPage;
