"use client";

import { getNodeTypeByType } from "@/lib/node-registry";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

export default function StatsWindow({ stats }) {
  const nodeRegistry = useSelector(
    (state) => state.library?.nodeRegistry || []
  );

  return (
    nodeRegistry &&
    stats && (
      <>
        {Object.keys(stats).length > 0 && (
          <div className="w-full mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">Node Stats</h3>
            </div>

            <div className="flex flex-col gap-4">
              {Object.entries(stats).map(([key, value]) => {
                const nodeType = getNodeTypeByType(
                  key.toLowerCase().split("-")[0],
                  nodeRegistry
                );

                return (
                  nodeType && (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Card className="bg-muted/30 w-full">
                        <CardContent className="p-4 overflow-auto">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col w-full">
                              <div className="font-medium">
                                {nodeType?.title}{" "}
                                <span className="text-xs text-muted-foreground opacity-50">
                                  ({key})
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {nodeType?.desc}
                              </div>

                              <div className="border-t border-black/50 dark:border-background mt-4 w-full opacity-50"></div>

                              <div className="mt-4 flex flex-col gap-2">
                                {Object.keys(value).map((key) => {
                                  return (
                                    <div
                                      key={key}
                                      className="flex items-center justify-between last:pb-2 gap-2"
                                    >
                                      <div className="text-sm text-muted-foreground max-w-60">
                                        {key}
                                      </div>
                                      <div className="flex-1 border-dashed border-black/50 dark:border-background border opacity-40"></div>
                                      <div className="text-sm font-medium max-w-60">
                                        {value[key]}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        )}
      </>
    )
  );
}
