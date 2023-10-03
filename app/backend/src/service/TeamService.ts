import IMatch from '../Interfaces/Match/IMatch';
import ITeam from '../Interfaces/Team/ITeam';
import { ITeamModel } from '../Interfaces/Team/ITeamModel';
import TeamModel from '../models/TeamModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import IMatchModel from '../Interfaces/Match/IMatchModel';
import MatchModel from '../models/MatchModel';
import ITeamLeaderboard from '../Interfaces/Team/ITeamLeaderboard';

export default class TeamService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
    private matchModel: IMatchModel = new MatchModel(),
  ) {}

  public async findAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }

  public async findTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findById(id);
    if (!team) return { status: 'NOT_FOUND', data: { message: 'Team not found' } };

    return { status: 'SUCCESSFUL', data: team };
  }

  public static totalPoints(teamMatches: IMatch[], id: number): number {
    const points = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id) {
        if (homeTeamGoals > awayTeamGoals) return acc + 3;
        if (homeTeamGoals === awayTeamGoals) return acc + 1;
      }
      return acc;
    }, 0);

    return points;
  }

  public static totalVictories(teamMatches: IMatch[], id: number): number {
    const victories = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && homeTeamGoals > awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return victories;
  }

  public static totalDraws(teamMatches: IMatch[], id: number): number {
    const draws = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && homeTeamGoals === awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return draws;
  }

  public static totalLosses(teamMatches: IMatch[], id: number): number {
    const losses = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && homeTeamGoals < awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return losses;
  }

  public static goalsFavor(teamMatches: IMatch[], id: number): number {
    const goalsFavor = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, homeTeamGoals } = curr;
      if (homeTeamId === id) return acc + homeTeamGoals;
      return acc;
    }, 0);

    return goalsFavor;
  }

  public static goalsOwn(teamMatches: IMatch[], id: number): number {
    const goalsOwn = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamGoals } = curr;
      if (homeTeamId === id) return acc + awayTeamGoals;
      // if (awayTeamId === id) return acc + homeTeamGoals;
      return acc;
    }, 0);

    return goalsOwn;
  }

  public static teamWithPoints(teamName: string, teamMatches: IMatch[], id: number):
  ITeamLeaderboard {
    const points = TeamService.totalPoints(teamMatches, id);
    const draws = TeamService.totalDraws(teamMatches, id);
    const losses = TeamService.totalLosses(teamMatches, id);
    const goalsFavor = TeamService.goalsFavor(teamMatches, id);
    const goalsOwn = TeamService.goalsOwn(teamMatches, id);
    return {
      name: teamName,
      totalPoints: points,
      totalGames: teamMatches.length,
      totalVictories: TeamService.totalVictories(teamMatches, id),
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((points / (teamMatches.length * 3)) * 100).toFixed(2)),
    };
  }

  public static teamClassification(teams: ITeamLeaderboard[]): ITeamLeaderboard[] {
    return teams.sort((a, b) => {
      switch (true) {
        case a.totalPoints > b.totalPoints:
          return -1;
        case a.totalPoints < b.totalPoints:
          return 1;
        case a.totalVictories > b.totalVictories:
          return -1;
        case a.totalVictories < b.totalVictories:
          return 1;
        case a.goalsBalance > b.goalsBalance:
          return -1;
        case a.goalsBalance < b.goalsBalance:
          return 1;
        default: return a.goalsFavor > b.goalsFavor
          ? -1 : 1;
      }
    });
  }

  public async leaderboard(): Promise<ServiceResponse<ITeamLeaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const matches = await this.matchModel.findAll();

    const teamsLeaderboard = teams.map((team) => {
      const { id } = team;
      const teamMatches = matches.filter((match) => match.homeTeamId === id
      && match.inProgress === false);
      return TeamService.teamWithPoints(team.teamName, teamMatches, id);
    });

    const teamsLeaderboardSorted = TeamService.teamClassification(teamsLeaderboard);

    return { status: 'SUCCESSFUL', data: teamsLeaderboardSorted };
  }
}
