import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { ChangeTheme } from "../../store/actions/util";
import {
  Paper,
  Avatar,
  Badge,
  ClickAwayListener,
  Hidden,
  Typography,
} from "@material-ui/core";
import {
  Search,
  House,
  Users,
  Bell,
  MessageSquareMore,
  User,
  Building2,
  BadgeCheck,
  ChevronDown,
  Clock,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import useConvexUser from "../../hooks/useConvexUser";
import MenuItem from "./menuItem/MenuItem";
import MeDropdown from "./MeDropdown";
import Style from "./Style";

const RECENT_SEARCHES_KEY = "turtlein_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const getRecentSearches = () => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  const trimmed = term.trim();
  if (!trimmed) {
    return;
  }

  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((item) => item !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
};

const Header = ({
  activeTab,
  setActiveTab,
  onNavigateProfile,
  onNavigateHome,
}) => {
  const classes = Style();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.util);
  const authActions = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const signOut = authActions?.signOut ?? (() => Promise.resolve());
  const user = useConvexUser();
  const photoURL = user?.photoURL;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMeDropdownOpen, setIsMeDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    isAuthenticated && user?._id ? { userId: user._id } : "skip"
  );
  const users = useQuery(
    api.users.searchUsers,
    debouncedTerm ? { query: debouncedTerm } : "skip"
  );
  const posts = useQuery(
    api.posts.searchPosts,
    debouncedTerm ? { query: debouncedTerm } : "skip"
  );
  const companies = useQuery(
    api.companies.searchCompanies,
    debouncedTerm ? { query: debouncedTerm } : "skip"
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const userResults = users ?? [];
  const postResults = posts ?? [];
  const companyResults = companies ?? [];
  const hasSearchTerm = searchTerm.trim().length > 0;
  const showDropdown = isSearchFocused;
  const isSearchLoading =
    Boolean(debouncedTerm) &&
    (users === undefined || posts === undefined || companies === undefined);

  const getDescriptionSnippet = (description = "") => {
    if (description.length <= 60) {
      return description;
    }

    return `${description.slice(0, 60)}...`;
  };

  const closeSearch = useCallback(() => {
    setIsSearchFocused(false);
    setIsSearchOpen(false);
  }, []);

  const getFollowerLabel = (count) => {
    if (count === 1) {
      return "1 follower";
    }
    return `${count} followers`;
  };

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setDebouncedTerm("");
    setIsSearchFocused(false);
    setIsSearchOpen(false);
  }, []);

  const handleSearchChange = (event) => {
    const nextTerm = event.target.value;
    setSearchTerm(nextTerm);
    setIsSearchOpen(nextTerm.trim().length > 0);
    setIsMeDropdownOpen(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setRecentSearches(getRecentSearches());
    if (searchTerm.trim().length > 0) {
      setIsSearchOpen(true);
    }
    setIsMeDropdownOpen(false);
  };

  const handleResultKeyDown = (event, onActivate) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    setDebouncedTerm(term);
    setIsSearchOpen(true);
  };

  const handleUserResultClick = (resultUser) => {
    saveRecentSearch(searchTerm);
    onNavigateProfile({
      username: resultUser?.username ?? null,
      userId: resultUser?._id ?? null,
    });
    clearSearch();
  };

  const handlePostResultClick = (postId) => {
    saveRecentSearch(searchTerm);
    if (typeof onNavigateHome === "function") {
      onNavigateHome();
    } else {
      setActiveTab("home");
    }
    clearSearch();

    window.setTimeout(() => {
      const postElement = document.getElementById(`post-${postId}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleCompanyResultClick = (slug) => {
    if (!slug) {
      return;
    }

    saveRecentSearch(searchTerm);
    navigate(`/company/${encodeURIComponent(slug)}`);
    clearSearch();
  };

  const handleMeTriggerClick = () => {
    closeSearch();
    setIsMeDropdownOpen((prev) => !prev);
  };

  const isHomeActive = activeTab === "home";
  const isNetworkActive = activeTab === "network";
  const isMessagingActive = activeTab === "messaging";
  const isNotificationsActive = activeTab === "notifications";
  const notificationsNavIcon = (
    <Bell size={24} strokeWidth={isNotificationsActive ? 2.25 : 1.75} />
  );

  const items = [
    {
      key: "home",
      Icon: <House size={24} strokeWidth={isHomeActive ? 2.25 : 1.75} />,
      title: "Home",
      arrow: false,
      onClick: () => setActiveTab("home"),
      isActive: isHomeActive,
    },
    {
      key: "network",
      Icon: <Users size={24} strokeWidth={isNetworkActive ? 2.25 : 1.75} />,
      title: "My Network",
      arrow: false,
      onClick: () => setActiveTab("network"),
      isActive: isNetworkActive,
    },
    {
      key: "messaging",
      Icon: <MessageSquareMore size={24} strokeWidth={isMessagingActive ? 2.25 : 1.75} />,
      title: "Messaging",
      arrow: false,
      onClick: () => setActiveTab("messaging"),
      isActive: isMessagingActive,
    },
    {
      key: "notifications",
      Icon: isAuthenticated ? (
        <Badge
          color="primary"
          badgeContent={unreadCount ?? 0}
          invisible={!unreadCount}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {notificationsNavIcon}
        </Badge>
      ) : (
        notificationsNavIcon
      ),
      title: "Notifications",
      arrow: false,
      onClick: () => setActiveTab("notifications"),
      isActive: isNotificationsActive,
    },
  ];

  const navigateToHome = () => {
    if (typeof onNavigateHome === "function") {
      onNavigateHome();
      return;
    }
    setActiveTab("home");
  };

  const tabItems = [
    {
      key: "home",
      icon: House,
      onClick: navigateToHome,
      isActive: activeTab === "home",
    },
    {
      key: "network",
      icon: Users,
      onClick: () => setActiveTab("network"),
      isActive: activeTab === "network",
    },
    {
      key: "messaging",
      icon: MessageSquareMore,
      onClick: () => setActiveTab("messaging"),
      isActive: activeTab === "messaging",
    },
    {
      key: "notifications",
      icon: Bell,
      onClick: () => setActiveTab("notifications"),
      isActive: activeTab === "notifications",
    },
    {
      key: "profile",
      icon: User,
      onClick: () =>
        onNavigateProfile({
          username: user?.username ?? null,
          userId: user?._id ?? null,
        }),
      isActive: false,
    },
  ];

  return (
    <Paper elevation={0} className={classes.header}>
      <div className={classes.header__container}>
        <div className={classes.header__logo}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              cursor: "pointer",
            }}
            onClick={navigateToHome}
          >
            <span style={{
              color: theme.palette.primary.main,
              fontSize: 22,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}>TurtleIn</span>
          </span>
          <ClickAwayListener onClickAway={closeSearch}>
            <div
              className={`${classes.search__wrapper} ${
                isSearchFocused ? classes.search__wrapperExpanded : ""
              }`}
            >
              <div className={classes.search}>
                <Search size={20} strokeWidth={1.75} />
                <input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                />
              </div>
              {showDropdown && (
                <Paper className={classes.searchDropdown} elevation={3}>
                  {hasSearchTerm ? (
                    isSearchLoading ? (
                      <Typography className={classes.searchEmptyState}>Searching...</Typography>
                    ) : (
                      <>
                        <Typography className={classes.searchSectionHeader}>Users</Typography>
                        {userResults.length > 0 ? (
                          userResults.map((resultUser) => (
                            <div
                              key={resultUser._id}
                              className={classes.searchResultItem}
                              onClick={() => handleUserResultClick(resultUser)}
                              onKeyDown={(event) =>
                                handleResultKeyDown(event, () =>
                                  handleUserResultClick(resultUser)
                                )
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <Avatar
                                src={resultUser.photoURL}
                                alt={resultUser.displayName}
                                className={classes.searchResultAvatar}
                              />
                              <div className={classes.searchResultContent}>
                                <Typography className={classes.searchResultPrimary}>
                                  {resultUser.displayName}
                                </Typography>
                                <Typography className={classes.searchResultSecondary}>
                                  {resultUser.title}
                                </Typography>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Typography className={classes.searchEmptyState}>
                            No users found.
                          </Typography>
                        )}

                        <Typography className={classes.searchSectionHeader}>Posts</Typography>
                        {postResults.length > 0 ? (
                          postResults.map((post) => (
                            <div
                              key={post._id}
                              className={classes.searchResultItem}
                              onClick={() => handlePostResultClick(post._id)}
                              onKeyDown={(event) =>
                                handleResultKeyDown(event, () =>
                                  handlePostResultClick(post._id)
                                )
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <div className={classes.searchResultContent}>
                                <Typography className={classes.searchResultPrimary}>
                                  {post.author?.displayName ?? "Unknown user"}
                                </Typography>
                                <Typography className={classes.searchResultSecondary}>
                                  {getDescriptionSnippet(post.description)}
                                </Typography>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Typography className={classes.searchEmptyState}>
                            No posts found.
                          </Typography>
                        )}

                        <Typography className={classes.searchSectionHeader}>Companies</Typography>
                        {companyResults.length > 0 ? (
                          companyResults.map((company) => (
                            <div
                              key={company.slug}
                              className={classes.searchResultItem}
                              onClick={() => handleCompanyResultClick(company.slug)}
                              onKeyDown={(event) =>
                                handleResultKeyDown(event, () =>
                                  handleCompanyResultClick(company.slug)
                                )
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <Avatar
                                src={company.logoURL ?? undefined}
                                alt={company.name}
                                className={classes.searchResultAvatar}
                              >
                                {!company.logoURL ? <Building2 size={16} strokeWidth={1.75} /> : null}
                              </Avatar>
                              <div className={classes.searchResultContent}>
                                <div className={classes.searchResultPrimaryRow}>
                                  <Typography className={classes.searchResultPrimary}>
                                    {company.name}
                                  </Typography>
                                  {company.isVerified ? (
                                    <BadgeCheck
                                      className={classes.searchVerifiedIcon}
                                      size={16}
                                      strokeWidth={1.75}
                                      aria-label="Verified company"
                                    />
                                  ) : null}
                                </div>
                                <Typography className={classes.searchResultSecondary}>
                                  {`${company.industry || "Unknown industry"} • ${getFollowerLabel(
                                    company.followerCount
                                  )}`}
                                </Typography>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Typography className={classes.searchEmptyState}>
                            No companies found.
                          </Typography>
                        )}
                      </>
                    )
                  ) : recentSearches.length > 0 ? (
                    <>
                      <Typography className={classes.searchSectionHeader}>Recent</Typography>
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className={classes.recentSearchItem}
                          onClick={() => handleRecentSearchClick(term)}
                          onKeyDown={(event) =>
                            handleResultKeyDown(event, () => handleRecentSearchClick(term))
                          }
                          role="button"
                          tabIndex={0}
                        >
                          <Clock size={16} strokeWidth={1.75} />
                          <span>{term}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <Typography className={classes.searchEmptyState}>
                      Try searching for people, posts, or companies.
                    </Typography>
                  )}
                </Paper>
              )}
            </div>
          </ClickAwayListener>
          <Avatar
            src={photoURL}
            onClick={() =>
              onNavigateProfile({
                username: user?.username ?? null,
                userId: user?._id ?? null,
              })
            }
            style={{ cursor: "pointer" }}
          />
        </div>
        <div
          className={`${classes.header__nav} ${
            isSearchFocused ? classes.header__navCompact : ""
          }`}
        >
          {items.map(({ key, Icon, title, arrow, onClick, isActive }) => (
            <div
              key={key}
              className={`${classes.headerNavItem} ${
                isActive ? classes.headerNavItemActive : ""
              }`}
            >
              <MenuItem
                Icon={Icon}
                title={title}
                arrow={arrow}
                onClick={onClick}
                hideLabels={isSearchFocused}
              />
            </div>
          ))}
        </div>

        <div className={classes.headerNavDivider} />

        <div className={classes.meTrigger__wrapper}>
          <div className={classes.meTrigger} onClick={handleMeTriggerClick}>
            <Avatar src={photoURL} className={classes.meTrigger__avatar} />
            <Hidden mdDown>
              <div className={classes.meTrigger__label}>
                <span>Me</span>
                <ChevronDown size={16} strokeWidth={1.75} />
              </div>
            </Hidden>
          </div>
          <MeDropdown
            open={isMeDropdownOpen}
            user={user}
            isDarkMode={mode}
            onToggleTheme={() => dispatch(ChangeTheme())}
            onViewProfile={() => {
              onNavigateProfile({
                username: user?.username ?? null,
                userId: user?._id ?? null,
              });
              setIsMeDropdownOpen(false);
            }}
            onSignOut={() => {
              signOut();
              setIsMeDropdownOpen(false);
            }}
            onClose={() => setIsMeDropdownOpen(false)}
          />
        </div>

        <Paper className={classes.header__bottom__nav}>
          {tabItems.map(({ key, icon: Icon, onClick, isActive }) => (
            <Icon
              key={key}
              size={28}
              strokeWidth={isActive ? 2.25 : 1.75}
              onClick={onClick}
              aria-label={key}
              className={`${classes.bottomNavIcon} ${
                isActive ? classes.bottomNavIconActive : ""
              }`}
            />
          ))}
        </Paper>
      </div>

      {isSearchFocused && (
        <div className={classes.searchBackdrop} onClick={closeSearch} />
      )}
    </Paper>
  );
};

export default Header;
