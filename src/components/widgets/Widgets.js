import React from "react";
import { useQuery, useMutation } from "convex/react";
import { Paper, Avatar } from "@material-ui/core";
import { MoreHorizontal, Plus } from "lucide-react";
import { api } from "../../convex/_generated/api";
import useConvexUser from "../../hooks/useConvexUser";
import Style from "./Style";

const SUPERTURTLE_SLUG = "superturtle";
const FALLBACK_NAME = "SuperTurtle";
const FALLBACK_LOGO = "/turtle-mascot.png";
const FALLBACK_TAGLINE = "Slow and steady wins the race.";

const Widgets = () => {
  const classes = Style();
  const user = useConvexUser();

  const company = useQuery(api.companies.getCompanyBySlug, {
    slug: SUPERTURTLE_SLUG,
  });
  const followerCount = useQuery(
    api.companies.getFollowerCount,
    company?._id ? { companyId: company._id } : "skip",
  );
  const followCompany = useMutation(api.companies.followCompany);

  const name = company?.name ?? FALLBACK_NAME;
  const logo = company?.logoUrl ?? FALLBACK_LOGO;
  const tagline = company?.tagline ?? FALLBACK_TAGLINE;
  const followers = followerCount ?? 0;

  const handleFollow = async () => {
    if (!user?._id || !company?._id) return;
    try {
      await followCompany({ companyId: company._id });
    } catch (err) {
      // silently ignore
    }
  };

  return (
    <div className={classes.widgets}>
      <Paper className={classes.promotedCard}>
        <div className={classes.promotedHeader}>
          <span className={classes.promotedLabel}>Promoted</span>
          <MoreHorizontal size={16} strokeWidth={1.75} className={classes.promotedMore} />
        </div>
        <div className={classes.companyBody}>
          <Avatar src={logo} variant="square" className={classes.companyLogo} />
          <div className={classes.companyInfo}>
            <span className={classes.companyName}>{name}</span>
            <span className={classes.personalizedMessage}>{tagline}</span>
          </div>
        </div>
        {followers > 0 && (
          <p className={classes.updateNote}>
            {followers.toLocaleString()} follower{followers !== 1 ? "s" : ""}
          </p>
        )}
        <button className={classes.followButton} onClick={handleFollow}>
          <Plus size={16} strokeWidth={2} />
          Follow
        </button>
      </Paper>
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          <span className={classes.footerLink}>About</span>
          <span className={classes.footerLink}>Accessibility</span>
          <span className={classes.footerLink}>Help Center</span>
          <span className={classes.footerLink}>Privacy & Terms</span>
        </div>
        <p className={classes.footerCopyright}>TurtleIn Corporation &copy; 2026</p>
      </div>
    </div>
  );
};

export default Widgets;
