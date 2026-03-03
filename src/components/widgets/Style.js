import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  widgets: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  promotedCard: {
    borderRadius: 12,
    overflow: "hidden",
    padding: "12px 16px",
  },
  promotedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  promotedLabel: {
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
  promotedMore: {
    color: theme.palette.text.secondary,
    cursor: "pointer",
  },
  companyBody: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 4,
    flexShrink: 0,
  },
  companyInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.text.primary,
    lineHeight: 1.3,
  },
  personalizedMessage: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
    marginTop: 2,
  },
  updateNote: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    margin: "4px 0 8px",
  },
  followButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.primary.main,
    backgroundColor: "transparent",
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    cursor: "pointer",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    "&:hover": {
      backgroundColor:
        theme.palette.type === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.04)",
      borderColor: theme.palette.primary.dark,
    },
  },
  footer: {
    marginTop: 16,
    padding: "0 8px",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px 12px",
  },
  footerLink: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  },
  footerCopyright: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    marginTop: 8,
  },
}));
