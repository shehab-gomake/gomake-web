import React, { Component, ReactNode, useEffect, useState } from "react";
import log from "@/utils/logger";
import { addRequestToSession, getSessionData } from "@/utils/sessionManager";
import { useRecoilValue } from "recoil";
import { userState } from "@/store";
import PageNotFound from "@/pages/404.page";

interface ErrorBoundaryState {
  hasError: boolean;
}
interface ErrorBoundaryProps {
  children: ReactNode;
  userId: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps & { userId: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //     log.error("Error caught by ErrorBoundary:", error, errorInfo);

  //     const summary = "Error in application";
  //     const description = `An error occurred: ${error.toString()}\n\n${errorInfo.componentStack}`;
  //     // log.error('User ID:', userId);

  //     // createJiraIssue(summary, description).catch(err => {
  //     //   log.error('Failed to create Jira issue:', err);
  //     // });

  //     log.error("ErrorBoundary -> componentDidCatch -> error", summary, description);
  //   }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { userId } = this.props;

    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    console.error("User ID:", userId);
    addRequestToSession({ userId, error, errorInfo });
    const sessionData = getSessionData();
    if (sessionData) {
      log.info("Session data:", userId, sessionData);
      console.log("Session data:", userId, sessionData);
    }
  }

  // handleReload = () => {
  //   this.setState({ hasError: false });
  //   window.location.reload();
  // };

  render() {
    if (this.state.hasError) {
      return (
        // <div>
        //   <h1>Something went wrong.</h1>
        //   <button onClick={this.handleReload}>Reload Page</button>
        // </div>
        <PageNotFound />
      );
    }

    return this.props.children;
  }
}

const EnhancedErrorBoundary = ({ children }: { children: ReactNode }) => {
  // const userStateValue = useRecoilValue<any>(userState);
  // const [user, setUser] = useState<any>(userStateValue || {});

  // useEffect(() => {
  //   if (userStateValue) {
  //     setUser(userStateValue);
  //     console.log("userStateValue updated", userStateValue);
  //   }
  // }, [userStateValue]);
  // const user = { userId: "123" };
  const user = useRecoilValue<any>(userState);
  if (!user) {
    console.log("user not loaded yet");
    return <div>Loading...</div>;
  }

  return <ErrorBoundary userId={user.userId}>{children}</ErrorBoundary>;
};

export default EnhancedErrorBoundary;
