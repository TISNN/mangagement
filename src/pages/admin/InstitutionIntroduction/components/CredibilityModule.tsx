import React, { useMemo, useState } from 'react';
import { Banknote, Check, Copy, MapPin, ShieldCheck, Smartphone, Timer, Wallet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { ContactEntry, CredentialItem, LocationItem, PaymentChannel } from '../types';

interface CredibilityModuleProps {
  credentials: CredentialItem[];
  locations: LocationItem[];
  payments: PaymentChannel[];
  contacts: ContactEntry[];
  onRequestVisit: () => void;
}

const PAYMENT_ICON: Record<PaymentChannel['type'], React.ComponentType<{ className?: string }>> = {
  bank: Banknote,
  wechat: Smartphone,
  alipay: Wallet,
};

export const CredibilityModule: React.FC<CredibilityModuleProps> = ({ credentials, locations, payments, contacts, onRequestVisit }) => {
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentChannel | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);

  const expiringSoonCredentials = useMemo(
    () =>
      credentials.filter((item) => {
        if (!item.expireDate) return false;
        const diff = new Date(item.expireDate).getTime() - Date.now();
        const days = diff / (1000 * 60 * 60 * 24);
        return days > 0 && days < 90;
      }),
    [credentials],
  );

  const handlePaymentVerify = () => {
    if (verificationCode.trim().length >= 4) {
      setIsVerified(true);
    }
  };

  const handleContactAction = async (contact: ContactEntry) => {
    setCopiedContactId(null);
    if (contact.type === 'phone') {
      window.open(`tel:${contact.value}`);
      return;
    }
    if (contact.type === 'email') {
      window.open(`mailto:${contact.value}`);
      return;
    }
    if (contact.type === 'form') {
      window.open(contact.value, '_blank');
      return;
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(contact.value);
        setCopiedContactId(contact.id);
      } catch (error) {
        console.warn('复制失败，请手动复制', error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">企业资质与合规证明</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">所有证件均可申请线下原件核验，线上版本均经过水印与脱敏处理。</p>
          </div>
          {expiringSoonCredentials.length > 0 && (
            <Badge className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              <Timer className="mr-1 h-3.5 w-3.5" />
              {expiringSoonCredentials.length} 项证件即将到期，已安排年检
            </Badge>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {credentials.map((credential) => (
            <Card key={credential.id} className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{credential.type}</p>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{credential.title}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>发证机关：{credential.issuedBy}</p>
                  <p>发证日期：{credential.issueDate}</p>
                  {credential.expireDate && <p>有效期至：{credential.expireDate}</p>}
                  <p>证件编号：{credential.credentialNumber}</p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">{credential.description}</p>

                {credential.caution && (
                  <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-600 dark:bg-amber-500/10 dark:text-amber-200">{credential.caution}</div>
                )}
              </div>

              <Button variant="outline" className="mt-4" onClick={() => setSelectedCredential(credential)}>
                查看证件扫描件
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">线下校区与服务网络</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">支持预约参观教室、会议室与活动空间，了解真实教学环境与交付团队。</p>
          </div>
          <Button onClick={onRequestVisit} className="bg-blue-600 text-white hover:bg-blue-500">
            预约线下参观
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="flex h-full flex-col gap-4 rounded-3xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-200">{location.name}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{location.address}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                {location.contactPhone}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">营业时间：{location.businessHours}</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {location.transportGuide.map((guide) => (
                  <li key={guide} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(location.mapUrl, '_blank')}>
                  查看地图
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">官方收款账户</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">所有转账与收款均通过以下渠道，请务必核对信息后再付款。</p>
          </div>
          <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
            <Check className="mr-1 h-3.5 w-3.5" />
            通道均通过最新风控校验
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {payments.map((channel) => {
            const Icon = PAYMENT_ICON[channel.type];
            return (
              <Card key={channel.id} className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {channel.type === 'bank' ? '银行对公账户' : channel.type === 'wechat' ? '企业微信收款' : '支付宝商家账户'}
                      </p>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{channel.displayName}</h3>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">账户信息（部分打码）</p>
                    <p className="mt-2 font-semibold text-gray-900 dark:text-white">{channel.accountMasked}</p>
                    {channel.bankName && <p className="text-xs text-gray-500 dark:text-gray-400">开户行：{channel.bankName}</p>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">最新校验：{channel.lastVerifiedAt}</p>
                  {channel.notes && <p className="rounded-2xl bg-blue-50 p-3 text-xs text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">{channel.notes}</p>}
                </div>

                <Button variant="outline" onClick={() => {
                  setSelectedPayment(channel);
                  setVerificationCode('');
                  setIsVerified(false);
                }}>
                  查看完整账号 / 二维码
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">联系我们</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">多种渠道随时响应，24 小时内为你匹配合适的顾问团队。</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-200">{contact.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{contact.value}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleContactAction(contact)}>
                  {contact.actionLabel ?? '立即联系'}
                </Button>
                {copiedContactId === contact.id && (
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                    已复制
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(selectedCredential)} onOpenChange={(open) => !open && setSelectedCredential(null)}>
        {selectedCredential && (
          <DialogContent className="max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCredential.title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCredential.issuedBy} · {selectedCredential.issueDate}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <img
                src={selectedCredential.mediaUrl}
                alt={selectedCredential.title}
                className="w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-700"
              />
              <p>证件编号：{selectedCredential.credentialNumber}</p>
              {selectedCredential.expireDate && <p>有效期至：{selectedCredential.expireDate}</p>}
              <p>{selectedCredential.description}</p>
              {selectedCredential.caution && <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-600 dark:bg-amber-500/10 dark:text-amber-200">{selectedCredential.caution}</p>}
            </div>
            <Button variant="outline" onClick={() => setSelectedCredential(null)}>
              关闭
            </Button>
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        open={Boolean(selectedPayment)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPayment(null);
            setVerificationCode('');
            setIsVerified(false);
          }
        }}
      >
        {selectedPayment && (
          <DialogContent className="max-w-md rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">验证后查看完整收款信息</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                为保障账户安全，请输入顾问提供的 4 位验证码。仅限签约家庭使用，请勿向他人透露。
              </DialogDescription>
            </DialogHeader>

            {!isVerified ? (
              <div className="space-y-4">
                <Input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  placeholder="请输入验证码（例如 8264）"
                  maxLength={6}
                  className="rounded-2xl border-gray-200 text-center text-lg tracking-[0.5rem] dark:border-gray-700"
                />
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-500" onClick={handlePaymentVerify} disabled={verificationCode.trim().length < 4}>
                  验证并查看
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <Card className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">账户名称</p>
                  <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedPayment.displayName}</p>
                  {selectedPayment.bankName && (
                    <>
                      <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">开户行</p>
                      <p className="mt-1 text-gray-900 dark:text-white">{selectedPayment.bankName}</p>
                    </>
                  )}
                  <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">完整账号</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.accountFull ?? selectedPayment.accountMasked}
                  </p>
                </Card>
                {selectedPayment.qrCodeUrl && (
                  <div className="space-y-2 text-center">
                    <img
                      src={selectedPayment.qrCodeUrl}
                      alt={`${selectedPayment.displayName} 收款二维码`}
                      className="mx-auto w-48 rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">请使用绑定手机号的客户端扫码，并备注学生姓名+项目。</p>
                  </div>
                )}
                <div className="rounded-2xl bg-blue-50 p-3 text-xs text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">
                  财务联系人：{selectedPayment.contactPerson}，若收款信息有任何疑问请第一时间与我们核实。
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedPayment(null);
                setVerificationCode('');
                setIsVerified(false);
              }}>
                关闭
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

